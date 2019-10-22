const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const User = require('./models/user');
const mongoose = require('mongoose');

// Require routes
const indexRouter = require('./routes/index');

const app = express();

// Connect to the mongodb Database ======================
mongoose.connect('mongodb://localhost:27017/auth-template2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to mongodb database');
});
// ======================================================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configure Passport and Sessions ======================
app.use(session({
  secret: 'anythingyouwanthere',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ======================================================

// Set local variables middleware =======================
app.use(function(req, res, next) {
  // default title page
  res.locals.title = 'Auth Template';
  // current user logged in if they exist
  res.locals.currentUser = req.user;
  // Flash messages
  res.locals.success = req.session.success || '';
  delete req.session.success;
  res.locals.error = req.session.error || '';
  delete req.session.error;
  // Move on to next function in middleware chain after pre-routes
  next();
});
// ======================================================

// Mount routes
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {  
  // Log the error in development
  console.log(err);
  // Add session error then redirect
  req.session.error = err.message;
  res.redirect('back');
});

module.exports = app;