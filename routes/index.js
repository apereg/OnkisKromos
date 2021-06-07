var express = require('express');
var router = express.Router();
var path = require('path');
const publicDirectory = path.join(__dirname, '../public');
const rootDirectory = path.join(__dirname,'../')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('login.html', {root: publicDirectory+'/login'});
});


module.exports = router; 
