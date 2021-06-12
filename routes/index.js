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
  console.log('Solo peude entrar si tiene token')
  var token = req.cookies.token;

  if (token) {
    jwt.verify(token, app.get('TOKEN_SECRET'), (err, user) => {
      if (err) {
        console.log('error de token');
        res.clearCookie('token');
        res.sendFile('/login.html', { root: publicDirectory + '/login' })
      } else {
        console.log('pALANTE')
        req.user = user;
        next();
      }
    });
  } else {
    console.log('no hay toiken')
    res.sendFile('/login.html', { root: publicDirectory + '/login' })
  }

}

router.get('/login', function (req, res) {
  res.sendFile('/login.html', { root: publicDirectory + '/login' })
});

/* GET home page. */
router.get('/', validateToken, function (req, res, next) {
  //res.sendFile('login.html', {root: publicDirectory+'/login'});
  console.log('Tiene token')
  console.log(req.user.rol)
  if (req.user.rol === 'Administrador') {
    res.sendFile('index.html', { root: publicDirectory + '/landingPageAdmin' });
    console.log("He iniciado sesion como admin");
  } else {
    res.sendFile('index.html', { root: publicDirectory + '/landingPageAdmin' });
    console.log("He iniciado sesion como socio");
  }

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

router.get('/getToken', (req, res) => {
  const token = jwt.sign(Object.assign({}, req.user), app.get('TOKEN_SECRET'), { expiresIn: '30m' });
  res.cookie('token', token, { httpOnly: true });
  console.log('token galleta')
  res.redirect('/')
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

router.post('/closeSession', validateToken, function (req, res) {
  console.log("Cerrando sesion");
  var token = req.cookies.token;
  res.clearCookie('token');
  res.sendFile('login.html', {root: publicDirectory+'/login'});
});


module.exports = router;
