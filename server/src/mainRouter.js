const express = require('express');
const router = express.Router();

// Import routes
const serverRouters = require('./routers/serverRouters');
const authRouters = require('./routers/authRouters');
const authzRouters = require('./routers/authzRouters');
const profileRouters = require('./routers/profileRouters');
const courseRouters = require('./routers/courseRouters');
const adminRouters = require('./routers/adminRouters');
const utilitiesRouters = require('./routers/utilitiesRouters');
const espRouters = require('./routers/espRouters');
const educationRouters = require('./routers/educationRouters');

// Use routes
router.use('/auth', authRouters);
router.use('/authz', authzRouters);
router.use('/profile', profileRouters);
router.use('/course', courseRouters);
router.use('/admin', adminRouters);
router.use('/utl', utilitiesRouters);
router.use('/esp', espRouters);
router.use('/edu', educationRouters);

//Self implement route
router.use('/', serverRouters);

module.exports = router;