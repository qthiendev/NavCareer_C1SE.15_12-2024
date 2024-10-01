const express = require('express');
const router = express.Router();

const authentication = require('./middlewares/authentication');

// Import routes
const testRouters = require('./routers/testRouters');
const authenticationRouters = require('./routers/authenticationRouters');

// Use routes
router.use('/test', testRouters);
router.use('/authentication', authenticationRouters);

module.exports = router;