/*
Developer : Kong Vungsovanreach | kv.sovanreach@gmail.com
Gitlab: https://gitlab.com/kongvungsovanreach/shoes-order-nodejs.git
Clean Code Day: 2022-08-04
*/

'use strict';

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../../model/user');

module.exports = function (passport) {
  passport.use(new LocalStrategy({
    emailField: 'email',
    passwordField: 'password'
    // passReqToCallback: true // ERROR: val.toString is not a function
  }, function (email, password, done) {
    User.findUserByEmail(email, (err, users) => {
      if (err) return done(err);

      if (!users.length) {
        return done(null, false, {
          message: 'No user found'
        });
      }
      const comparedPassword = bcrypt.compareSync(password, users[0].password);
      if (comparedPassword) {
        return done(null, users[0]);
      } else {
        return done(null, false, {
          message: 'Wrong password.'
        });
      }
    })
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function (email, done) {
    User.findUserByEmail(email, function (err, user) {
      done(err, user)
    })
  });
};
