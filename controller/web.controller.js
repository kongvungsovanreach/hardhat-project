/* Import required modules */
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const web3Service = require('../service/web3Service.service');
require('dotenv').config({ path: "../env_files/dapp.env" });

/* Get dashboard for user */
exports.getDashboard = async (req, res, next) => {
  const balance = await web3Service.checkBalance('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199');
  res.render('index', {
    user: {
      email: 'kongvungsovanreach'
    },
    balance: balance,
    title: process.env.SITE_NAME
  });
}

/* Dislay login page */
exports.getLoginPage = (req, res, next) => {
  res.render('login', {
    title: process.env.SITE_NAME
  });
}

/* Dislay signup page */
exports.getSignupPage = (req, res, next) => {
  res.render('signup', {
    title: process.env.SITE_NAME
  });
}

/* Handle login post request */
exports.loginAction = async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
}

/* Handle signup post request */
exports.signupAction = async (req, res, next) => {
  // New user object to add
  const newUser = {
    email: req.body.username,
    password: bcrypt.hashSync(req.body.password, 12),
    private_key: req.body.private_key
  };
  await User.addNew(newUser, async (err, user) => {
    if (!err) {
      res.redirect('/login');
    } else {
      console.log('error signup!')
    }
  })
}