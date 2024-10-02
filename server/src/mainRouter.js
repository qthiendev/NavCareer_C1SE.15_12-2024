const express = require('express');
const router = express.Router();

// Import routes
const serverRouters = require('./routers/serverRouters');
const authenticationRouters = require('./routers/authenticationRouters');
const profileRouters = require('./routers/profileRouters');


// Use routes
router.use('/authentication', authenticationRouters);
router.use('/profile', profileRouters);

//Self implement route
router.use('/', serverRouters);

module.exports = router;