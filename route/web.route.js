
/* Import required modules */
const express = require('express');
const router = express.Router()
const webController = require('../controller/web.controller');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth/auth_config');


/* Connect route to controller */
router.get('/dashboard',ensureAuthenticated, webController.getDashboard);
router.get('/login', forwardAuthenticated, webController.getLoginPage);
router.get('/signup', forwardAuthenticated, webController.getSignupPage);
router.post('/login', webController.loginAction);
router.post('/signup', webController.signupAction);

module.exports = router;