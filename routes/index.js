var express = require('express');
const cookieParser = require('cookie-parser');

var app = express()
app.use(cookieParser());

var router = express.Router();
var path = require('path');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../tokenConfig')


const { body } = require('express-validator');
const helpers = require('../lib/helpers');
const pool = require('../database');
const publicDirectory = path.join(__dirname, '../public');
const rootDirectory = path.join(__dirname, '../')

app.set('TOKEN_SECRET', config.TOKEN_SECRET);

function validateToken(req, res, next) {
  console.log('Se intenta acceder a un area que requiere validacion de Token.')
  var token = req.cookies.token;

  if (token) {
    jwt.verify(token, app.get('TOKEN_SECRET'), (err, user) => {
      if (err) {
        console.log('El token no es valido, eliminando y redirigiendo al login.');
        res.clearCookie('token');
        res.sendFile('/login.html', { root: publicDirectory + '/login' })
      } else {
        console.log('Token valido, se genera otro para mantener los 30 minutos de persistencia.')
        req.user = user;
        res.clearCookie('token')
        if(req.user.iat) delete req.user.iat
        if(req.user.exp) delete req.user.exp
        const token = jwt.sign(Object.assign({}, req.user), app.get('TOKEN_SECRET'), { expiresIn: 1800 });
        res.cookie('token', token, { httpOnly: true });
        next()
      }
    });
  } else {
    console.log('No hay token, redirigiendo al Login.')
    res.sendFile('/login.html', { root: publicDirectory + '/login' })
  }
}

function generateToken(req, res, next){
  console.log('Generando token para ' +req.user.username+ '.')
  if(req.user.iat) delete req.user.iat
  if(req.user.exp) delete req.user.exp
  const token = jwt.sign(Object.assign({}, req.user), app.get('TOKEN_SECRET'), { expiresIn: 1800 });
  res.cookie('token', token, { httpOnly: true });
  next()
}

/* GET home page. */
router.get('/', validateToken, function (req, res, next) {
  console.log('Se redirige al usuario ' +req.user.username+ ' a la ventana de ' +req.user.rol + '.')
  if (req.user.rol === 'Administrador') {
    res.sendFile('index.html', { root: publicDirectory + '/landingPageAdmin' });
    console.log("He iniciado sesion como admin");
  } else {
    res.sendFile('index.html', { root: publicDirectory + '/landingPageUser' });
    console.log("He iniciado sesion como socio");
  }
});


/* POST sign in */
router.post('/signin', function (req, res, next) {
  console.log(req.session.id)
  console.log(req.session.user)
  console.log(req.body.password);
  passport.authenticate('local.signin', {
    successRedirect: '/getToken',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);


});

/* POST sign up */
router.post('/signup', function (req, res, next) {
  console.log("ANDAMOS READY");
  console.log(req.body);
  passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
});

router.get('/login', function (req, res) {
  res.sendFile('/login.html', { root: publicDirectory + '/login' })
});

router.get('/getToken', generateToken, (req, res) => {
  res.redirect('/')
});

router.post('/closeSession', validateToken, function (req, res) {
  console.log("=========================================================Cerrando sesion");
  res.clearCookie('token')
  res.redirect('/')
});

/* POST get info from database */
router.post('/userInfo', validateToken, async function (req, res, next) {
  console.log("voy a la db");
  let user = req.user.username;

  console.log(user);
  var answer;
  try {
    answer = await pool.query('SELECT * FROM users WHERE username = ?', [user]);
  }catch(error) {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
  
  console.log("la answer es: " + answer[0]);
  res.end(JSON.stringify(answer[0]));
});

/* POST get info from database collections*/
router.post('/userAlbums', validateToken, async function (req, res) {
  console.log("voy a la db de las colecciones");
  let iduser = req.user.idusers, output=[];

  console.log(iduser);
  var answerNumCol, answerNumColUser, percentage;
  try {
    answerNumCol = await pool.query('SELECT * FROM collections');
    answerNumColUser = await pool.query('SELECT * FROM albums WHERE iduser = ?', [iduser]);
  }catch(error) {
    console.log(error);
    return done(null, false, req.flash('message', 'The collection does not exist.'));
  }
  console.log(answerNumColUser.length, answerNumCol.length);
  percentage = Math.round((answerNumColUser.length/answerNumCol.length)*100)/100;
  console.log("el porcentaje: " + percentage);
  output.push(percentage);

  var answerIdAlb, numCol = [], queryAux;
  try {
    answerIdAlb = await pool.query('SELECT idalbums, idcollection FROM albums WHERE iduser = ?', [iduser]);
    for (let i = 0; i < answerIdAlb.length; i++) {
      queryAux = await pool.query('SELECT * FROM albumcards WHERE idalbum = ?', [answerIdAlb[i].idalbums]);
      numCol.push(queryAux.length);
    }
  }catch(error) {
    console.log(error);
    return done(null, false, req.flash('message', 'The albumcards table does not exist.'));
  }
  output.push(answerIdAlb);
  output.push(numCol);
  console.log("el output final! :): " + output);
  res.end(JSON.stringify(output));
});

/* POST get info from database useralbum*/
router.post('/questions', validateToken, async function (req, res) {
  var user = req.user.username;
  console.log('Buscando 3 preguntas al azar en la base de datos para ' +user+ '.');

  var queryResult;
  try {
    queryResult = await pool.query('SELECT question, answer FROM questions ORDER BY RAND() LIMIT 3;');
  }catch(error) {
    return done(null, false, req.flash('message', 'Questions tables fails while getting questions.'));
  }

  console.log("la answer es: " + queryResult[0]);
  res.end(JSON.stringify(queryResult));

});

module.exports = router;