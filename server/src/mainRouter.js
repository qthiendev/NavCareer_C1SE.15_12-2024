const express = require('express');
const router = express.Router();

// Import routes
const authenticationRoutes = require('./routers/authenticationRouters');
const profileRoutes = require('./routers/profileRouters');
const courseRoutes = require('./routers/courseRouters');
const materialRoutes = require('./routers/materialRouters');
const educationRoutes = require('./routers/educationRouters');
const testRoutes = require('./routers/testRouters');

// Use routes
router.use('/authentication', authenticationRoutes);
router.use('/profile', profileRoutes);
router.use('/course', courseRoutes);
router.use('/material', materialRoutes);
router.use('/education', educationRoutes);
router.use('/test', testRoutes);

module.exports = router;
