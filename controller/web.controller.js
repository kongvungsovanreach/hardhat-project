/* Import required modules */
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../model/user');
require('dotenv').config({ path: "../env_files/dapp.env"});

/* Get dashboard for user */
exports.getDashboard = (req, res, next) => {
    res.render('index', {
      // user: req.user[0],
      title: process.env.SITE_NAME
    });
    // Coin.findAllTradingCoins(async (err, coins) => {
    //   await fetchPrice(coins).then(tempCoins => {
    //     res.render('index', {
    //       title: 'Crypto Monitoring',
    //       coins: tempCoins
    //     });
    //   })
    // })
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
    if(!err) {
      res.redirect('/login');
    }else {
      console.log('error signup!')
    }
  })
}