var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var debug        = require('debug')('app:http');

// Load local libraries.
var env      = require('./config/environment'),
    mongoose = require('./config/database'),
    routes   = require('./routes/api_routes');

// Instantiate a server application.
var app = express();

// Configure the application (and set it's title!).
app.set('title', process.env.TITLE);
app.set('safe-title', process.env.SAFE_TITLE);

// Create local variables for use thoughout the application.
app.locals.title = app.get('title');

// TODO: (PJ) turn on if development
// CORS (allows a separate client, like Postman, to send requests)…
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin',  '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

//   if ('OPTIONS' == req.method) {
//     res.send(200);
//   } else {
//     next();
//   }
// });

// Logging layer.
app.use(logger('dev'));

// Static routing layer.
app.use(favicon(path.join(__dirname, 'public', 'ga-favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

// Parse and debug requests.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true
}));
app.use(bodyParser.json());
app.use(debugReq);

// Validate content-type.
app.use(validateContentType);

// Our routes.
app.use('/api', routes);

// Catches all 404 routes.
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error-handling layer.
app.use(function(err, req, res, next) {
  err = (app.get('env') === 'development') ? err : {};

  res.status(err.status || 500).json({
    message: err.message,
    error: err
  });
});

function debugReq(req, res, next) {
  debug('params:', req.params);
  debug('query:',  req.query);
  debug('body:',   req.body);
  next();
}

function validateContentType(req, res, next) {
  var methods = ['PUT', 'PATCH', 'POST'];
  var type    = 'application/json';

  if (methods.indexOf(req.method) !== -1 && req.get('Content-Type') !== type) {
    res.status(400).send('Content-Type header must be application/json.');
  } else {
    next();
  }
}

module.exports = app;
