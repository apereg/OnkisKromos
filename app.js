var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var app = express();

var path = require('path');
var cookieParser = require('cookie-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//morgan
app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Error 404 Handler
app.use((error, req, res, next) => {
    if (!error.statusCode) error.statusCode = 500;

    if (error.statusCode === 404) {
        console.log(`${req.ip} tried to access ${req.originalUrl}`)
        return res.status(404).redirect('error404.html');
    }
    return res
        .status(error.statusCode)
        .json({ error: error.toString() });
});

module.exports = app;
