const express = require('express');
const router = express.Router();

// Import routes
const serverRouters = require('./routers/serverRouters');
const authRouters = require('./routers/authRouters');
const authzRouters = require('./routers/authzRouters');
const profileRouters = require('./routers/profileRouters');
const courseRouters = require('./routers/courseRouters');
const adminRouters = require('./routers/adminRouters');
const searchRouters = require('./routers/ulities/search');
const espRouters = require('./routers/espRouters');
const educationRouters = require('./routers/educationRouters');
const chatbot = require('./routers/chatbot');

// Use routes
router.use('/auth', authRouters);
router.use('/authz', authzRouters);
router.use('/profile', profileRouters);
router.use('/course', courseRouters);
router.use('/admin', adminRouters);
router.use('/utl', searchRouters);
router.use('/esp', espRouters);
router.use('/edu', educationRouters);
router.use('/chatbot', chatbot);

//Self implement route
router.use('/', serverRouters);

module.exports = router;