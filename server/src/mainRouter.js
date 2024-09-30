const express = require('express');
const router = express.Router();

const { authCheck } = require('./middlewares/authCheck');

// Import routes
const testRouters = require('./routers/testRouters');
const authenticationRouters = require('./routers/authenticationRouters');

// Use routes
router.get('/auth-check', authCheck, async (req, res) => {
    res.status(200).json({
        session_status: req.session_status,
        auth_id: req.auth_id,
        authz_id: req.authz_id,
        username: req.username,
    });
});
router.use('/test', testRouters);

router.use('/authentication', authenticationRouters);

module.exports = router;