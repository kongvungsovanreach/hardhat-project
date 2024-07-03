
/* Import required modules */
const express = require('express');
const router = express.Router()
const webController = require('../controller/web.controller');


/* Connect route to controller */
router.get('/dashboard', webController.getDashboard);
