'use strict';

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (process.env.UNDER_DEV == 'true') {
      return next();
    }
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('msg', 'Please login to view this resource');
    res.redirect('/login');
  },
  forwardAuthenticated: function (req, res, next) {
    if (process.env.UNDER_DEV == 'true') {
      return next();
    }
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  },

  adminAuthenticated: function (req, res, next) {
    if (process.env.UNDER_DEV == 'true') {
      return next();
    }
    if (req.isAuthenticated()) {
      const logginUserEmail = req.user[0].Email;
      const adminEmails = ['vungsovanreachkong@gmail.com','dev@gmail.com']
      if(adminEmails.includes(logginUserEmail)){
        return next();
      }else{
        res.render('403', {
          title: 'Crypto Monitoring - 403'
        });
      }
    }else{
      res.redirect('/login');
    }
  },
  apiRequestAuthorized: function (req, res, next) {
    // return next();
    // Development change
    if (process.env.UNDER_DEV == 'true') {
      return next();
    }
    if (req.headers.xapikey && req.headers.xapikey === "eyJhbGciOiJIUzI1NiJ9.e30.ZsNiImZZERkZDt7W_5TKDmGc518hh0avtgZzTuOiOvQ==") {
      return next();
    } else {
      return res.status(403).json({
        code: '403',
        message: 'API KEY is missing or you have registered an invalid one'
      });
    }
  }
}
