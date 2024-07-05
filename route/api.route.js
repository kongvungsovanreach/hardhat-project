
/* Import required modules */
const express = require('express');
const router = express.Router()
const apiController = require('../controller/api.controller');
// const web3Controller = require('../controller/web3.controller');
// const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth/auth_config');


/* Connect route to controller */
router.post('/api/borrow', apiController.borrow);
// router.get('/login', forwardAuthenticated, webController.getLoginPage);
// router.get('/signup', forwardAuthenticated, webController.getSignupPage);
// router.post('/login', webController.loginAction);
// router.post('/signup', webController.signupAction);

// router.get('/balance', web3Controller.getBalance)

module.exports = router;