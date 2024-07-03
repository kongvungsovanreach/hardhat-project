'use strict';
require('dotenv').config({ path: "./env_files/dapp.env"});

/* import required modules*/
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const webRouter = require('./route/web.route');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const app = express();
const { NODE_JS_ENV, SECRET } = process.env;

require('./config/auth/passport_config')(passport);
console.log('USED ENVIRONMENT STATE:', NODE_JS_ENV);

/* nodejs server configuration */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});
app.use(session({
  secret: SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 8.64e+7),
    maxAge: 8.64e+7
  }
}));

/* Passport middleware */
app.use(passport.initialize());
app.use(passport.session());

/* Connect flash */
app.use(flash());

app.use((err, req, res, next) => {
  /* set locals, only providing error in development */
  res.locals.message = err.message;
  console.log(res.locals.message)
  /* handle the error 500 */
  res.status(err.status || 500);
  res.json({
    code: '500',
    message: 'Internal Server Error'
  })
});

//point endpoint to route controller
app.use('/', webRouter);
  
/* handle any unfound request */
app.use((req, res, next) => {
  console.log(req.url)
  if (res.status(404)) {
    return res.render('404', {
      title: 'Page Not Found',
    });
  }
})

module.exports = app;