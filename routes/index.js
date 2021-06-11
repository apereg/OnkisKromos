var express = require('express');
var router = express.Router();
var path = require('path');

const passport = require('passport');
const { body } = require('express-validator');
const helpers = require('../lib/helpers');
const publicDirectory = path.join(__dirname, '../public');
const rootDirectory = path.join(__dirname,'../')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('login.html', {root: publicDirectory+'/login'});
});

/* POST sign in */
router.post('/signin', function(req, res, next) {
  req.session.user = 'a'
  console.log(req.session.id)
  console.log(req.session.user)
  console.log(req.body.password);

  /* Aqui iria un
  const token = jwt.sign(payload, app.get('llave'), {
   expiresIn: 1440
  });
  res.json({
   mensaje: 'Autenticación correcta',
   token: token
  });
  para devolver el token al usuario una vez se loguea
  (https://asfo.medium.com/autenticando-un-api-rest-con-nodejs-y-jwt-json-web-tokens-5f3674aba50e)
 */
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
});

/* GET Landing Page Admin */
router.get('/landingPageAdmin', (req, res) => {
  res.sendFile('index.html', {root: publicDirectory+'/landingPageAdmin'});
});

/* POST sign up */
router.post('/signup', function(req, res, next) {
  console.log("ANDAMOS READY");
  console.log(req.body);
  passport.authenticate('local.signup', {
    successRedirect: '/landingPageAdmin',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
});



module.exports = router; 
