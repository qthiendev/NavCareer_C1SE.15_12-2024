const express = require('express');
const router = express.Router();

// Import routes
const serverRouters = require('./routers/serverRouters');
const authRouters = require('./routers/authRouters');
const authzRouters = require('./routers/authzRouters');
const profileRouters = require('./routers/profileRouters');


// Use routes
router.use('/auth', authRouters);
router.use('/authz', authzRouters);
router.use('/profile', profileRouters);

//Self implement route
router.use('/', serverRouters);

module.exports = router;