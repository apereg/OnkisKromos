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
const publicDirectory = path.join(__dirname, '../public');
const rootDirectory = path.join(__dirname, '../')

app.set('TOKEN_SECRET', config.TOKEN_SECRET);

function validateToken(req, res, next) {
  console.log('Solo peude entrar si tiene token')
  var token = req.cookies.token;

  if (token) {
    jwt.verify(token, app.get('TOKEN_SECRET'), (err, user) => {
      if (err) {
        console.log('error de token')
        res.clearCookie('token')
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

/* POST sign in */
router.post('/signin', function (req, res, next) {
  console.log("SDKFSJDFKSJDFKLDSJFDLKSJDLKFDJSD");
  req.session.user = 'a'
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
  console.log('Touken')
  var a = Object.assign({}, req.user);
  console.log(a)
  const token = jwt.sign(a, app.get('TOKEN_SECRET'), { expiresIn: '30m' });
  console.log('token panero')
  res.cookie('token', token, { httpOnly: true });
  console.log('token galleta')
  res.redirect('/')
});

/* POST sign up */
router.post('/signup', function (req, res, next) {
  console.log("ANDAMOS READY");
  console.log(req.body);
  passport.authenticate('local.signup', {
    successRedirect: '/landingPageAdmin',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
});


module.exports = router;
