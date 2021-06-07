var express = require('express');
var logger = require('morgan');

var app = express();

var path = require('path');
var cookieParser = require('cookie-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var passport = require('passport');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "onkisko",
    insecureAuth: true
});
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to OnkisKromosDB!");
});

//Morgan
app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// error handler 
app.use((req, res, next) => {
    res.status(404).sendFile('error404.html', {root: path.join(__dirname, 'public/landingPageAdmin')});
    console.log(`${req.ip} tried to access ${req.originalUrl}`)
  });

module.exports = app;
