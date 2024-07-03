'use strict';
require('dotenv').config({ path: "./env_files/dapp.env"});

/* import required modules*/
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();


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
