const express = require('express');
const router = express.Router();

// Import routes
const serverRouters = require('./routers/serverRouters');
const authenticationRouters = require('./routers/authenticationRouters');


// Use routes
router.use('/authentication', authenticationRouters);

//Self implement route
router.use('/', serverRouters);

module.exports = router;