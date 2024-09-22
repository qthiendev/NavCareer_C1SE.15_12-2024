const express = require('express');
const router = express.Router();

// Import routes
const authenticationRoutes = require('./routers/authenticationRouter');
const profileRoutes = require('./routers/profileRoutes');
const courseRoutes = require('./routers/courseRoutes');
const educationRoutes = require('./routers/educationRoutes');
const testRoutes = require('./routers/testRoutes');

// Use routes
router.use('/authentication', authenticationRoutes);
router.use('/profile', profileRoutes);
router.use('/course', courseRoutes);
router.use('/education', educationRoutes);
router.use('/test', testRoutes);

module.exports = router;
