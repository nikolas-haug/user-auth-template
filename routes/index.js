// Main route for landing, login, register etc

const express = require('express');
const router = express.Router();
const { 
  getRegister,
  postRegister, 
  getLogin,
  postLogin, 
  getLogout,
  getProfile 
} = require('../controllers/index');
const { asyncErrorHandler, isLoggedIn } = require('../middleware/index');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

// GET /register
router.get('/register', getRegister);

// POST /register
router.post('/register', asyncErrorHandler(postRegister));

// GET /login
router.get('/login', getLogin);

// POST /login
router.post('/login', asyncErrorHandler(postLogin));

// GET /logout
router.get('/logout', getLogout);

// GET /profile
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

// PUT /profile/:user_id
router.put('/profile/:user_id', (req, res, next) => {
  res.send('GET /profile/:user_id');
});

// GET /forgot-password
router.get('/forgot', (req, res, next) => {
  res.send('GET /forgot');
});

// PUT /forgot
router.put('/forgot', (req, res, next) => {
  res.send('PUT /forgot');
});

// GET /reset/:token
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /reset/:token');
});

// PUT /reset/:token
router.put('/reset/:token', (req, res, next) => {
  res.send('PUT /reset/:token');
});

module.exports = router;
