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
const { request } = require('http');
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
        res.clearCookie('token');
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

router.get('/closeSession', function (req, res) {
  console.log("Cerrando sesion...");
  res.clearCookie('token');
  //location.reload();
  res.redirect('/login');
});

/* POST get info from database */
router.post('/userInfo', validateToken, async function (req, res, next) {
  console.log("Buscando informacion del usuario en la base de datos...");
  let user = req.user.username;
  var answer;
  try {
    answer = await pool.query('SELECT * FROM users WHERE username = ?', [user]);
  }catch(error) {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
  
  res.end(JSON.stringify(answer[0]));
});

/* POST get info from database collections*/
router.post('/userAlbums', validateToken, async function (req, res) {
  console.log("Buscando informacion de los albums en la base de datos...");
  let iduser = req.user.idusers, output=[];
  var answerNumCol, answerNumColUser, percentage;
  try {
    answerNumCol = await pool.query('SELECT * FROM collections');
    answerNumColUser = await pool.query('SELECT * FROM albums WHERE iduser = ?', [iduser]);
  }catch(error) {
    console.log(error);
    return done(null, false, req.flash('message', 'The collection does not exist.'));
  }
  percentage = Math.round((answerNumColUser.length/answerNumCol.length)*100)/100;
  output.push(percentage);

  var answerIdAlb, numCol = [], queryAux;
  try {
    answerIdAlb = await pool.query('SELECT idalbums, idcollection FROM albums WHERE iduser = ?', [iduser]);
    for (let i = 0; i < answerIdAlb.length; i++) {
      queryAux = await pool.query('SELECT * FROM albumcards WHERE idalbum = ?', [answerIdAlb[i].idalbums]);
      numCol.push(queryAux.length);
    }
  }catch(error) {
    return done(null, false, req.flash('message', 'The albumcards table does not exist.'));
  }
  output.push(answerIdAlb);
  output.push(numCol);
  res.end(JSON.stringify(output));
});

/* POST get three random questions from db table. */
router.post('/newQuestions', validateToken, async function (req, res) {
  var user = req.user.username;
  console.log('Buscando 3 preguntas al azar en la base de datos para ' +user+ '.');

  var queryResult;
  try {
    queryResult = await pool.query('SELECT question, answer FROM questions ORDER BY RAND() LIMIT 3;');
  }catch(error) {
    return done(null, false, req.flash('message', 'Questions tables fails while getting questions.'));
  }

  console.log('No te chives pero las preguntas son:')
  console.log(queryResult[0].question+ ' -> ' + queryResult[0].answer)
  console.log(queryResult[1].question+ ' -> ' + queryResult[1].answer)
  console.log(queryResult[2].question+ ' -> ' + queryResult[2].answer)

  res.end(JSON.stringify(queryResult));
});

/* POST get info from database collections*/
router.post('/collections', validateToken, async function (req, res) {
  console.log('Buscando informacion de las colecciones en la base de datos...');

  var queryResult;
  try {
    queryResult = await pool.query('SELECT * FROM collections;');
  }catch(error) {
    return done(null, false, req.flash('message', 'Questions tables fails while getting questions.'));
  }
  console.log("Colecciones buscada");
  res.end(JSON.stringify(queryResult));

});

/* POST get info from database collections cards*/
router.post('/cardsCollections', validateToken, async function (req, res) {
  console.log('Buscando informacion de los kromos en la base de datos...');
  var ids = req.body.id.split(",");

  var queryResult, output = [];
  try {
    for(let i=0; i<ids.length; i++) {
      queryResult = await pool.query('SELECT sum(remainingUnits) FROM cards where idcollections = ?;', ids[i]);
      var aux = JSON.stringify(queryResult);
      var number = aux.split(":")[1].split("}")[0]
      output.push({"id": ids[i], "result": number});
    }
  }catch(error) {
    return done(null, false, req.flash('message', 'Questions tables fails while getting questions.'));
  }

  res.end(JSON.stringify(output));

});


router.post('/submit', validateToken, (req, res) => {

  const secretKey = '6Ldn_CsbAAAAAKVB9QJq2PYULMsYZ1mMaD_1dn8b';
  const userKey = req.params.captcha;

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.socket.remoteAddress}`;

  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);

    if(body.success !== undefined && !body.success){
      return res.json({"success": false, "msg":"Ha habido un error, intentalo de nuevo"});
    }else{
      return res.json({"success": true, "msg":"Has ganado 50 monedas!"});
    }
  });

  /*
    //captcha verify
    console.log('hola');
    const secretKey = '6Ldn_CsbAAAAAKVB9QJq2PYULMsYZ1mMaD_1dn8b';
    const userKey = req.params.captcharesponse;

    const captchaVerified = await fetch('https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + userKey, {
            method: "POST"
        })
        .then(_res => _res.json());

    if (captchaVerified.success === true) {
        //Add coins
        console.log("Has ganado 50 monedas!");

    } else {
        console.log("Ha habido un error, intentalo de nuevo");
    }
    res.end();
    */
});


router.post('/addPoints',validateToken, async(req, res) => {
  console.log('Se deberian dar ' +req.body.points+ ' al usuario')
  //todo add points
  res.end();
});

module.exports = router;