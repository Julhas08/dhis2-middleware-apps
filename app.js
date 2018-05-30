/**
* @name dhis2-middleware-apps
* @author Julhas Sujan
* @version 1.0.0
* @since December-2017
*/
var express      = require('express');
var app          = express();
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

// Route location
var dbConnect      = require('./src/app/config/db-config');
var login          = require('./routes/login');
var dashboard      = require('./routes/dashboard'); 
var schedular      = require('./routes/schedular');
var settingsRoutes = require('./routes/settings');
var middlewareApps = require('./routes/middleware-apps');
var reports        = require('./routes/reports');
// FB login
var routesPassport = require('./routes/route-passport');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes 
app.use('/', login); 
app.use('/', dashboard);
app.use('/', schedular);
app.use('/', settingsRoutes);
app.use('/', middlewareApps);
app.use('/', reports);
// FB Login
app.use('/', routesPassport);

// Logger
var logger4js = require('./src/logger/log4js');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err    = new Error('Not Found');
  err.status = 404;
  logger4js.getLoggerConfig().error(err);
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  logger4js.getLoggerConfig().error(err);
});

module.exports = app;
