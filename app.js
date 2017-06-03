var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var env = process.env.NODE_ENV || 'development';
env = env.toLowerCase();
if(env != 'development' && env != 'production') {
    throw new Error('Unknown enviroment: ' + env);
}

var config = require('./config/' + env);
var db = require('./db');

var index = require('./routes/index');
var appusers = require('./routes/appusers');
var music = require('./routes/music');

var app = express();

app.set('env', env);
console.log('You are running this app at ' + env + ' enviroment now!');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('music', path.join(__dirname, 'public/music'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('Im the best programmer in the world!'));
app.use(session({
  secret: 'Believe it or not, Im the best programmer in the world!',
  cookie:{
    maxAge: 30*1000,
  },
  store: new RedisStore({
      port: 6379,
      host: '127.0.0.1',
  }),
  resave: true,
  saveUninitialized: true,
}));

if(env == 'development') app.use(express.static(path.join(__dirname, 'dev_public')));
else if(env == 'production') app.use(express.static(path.join(__dirname, 'public')));
else throw new Error('Unknown enviroment: ' + env);

app.use(db.init(config));

app.use('/', index);
app.use('/appusers', appusers);
app.use('/music', music);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(config.port, function () {
  console.log('app listening on port 3000!');
});

module.exports = app;
