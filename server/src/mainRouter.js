const express = require('express');
const router = express.Router();

const { authCheck } = require('./middlewares/authCheck');
const { authCheckSend } = require('./middlewares/authCheckSend');

// Import routes
const testRouters = require('./routers/testRouters');
const authenticationRouters = require('./routers/authenticationRouters');

// Use routes
router.get('/auth-check', authCheck, authCheckSend);
router.use('/test', testRouters);

router.use('/authentication', authenticationRouters);

module.exports = router;