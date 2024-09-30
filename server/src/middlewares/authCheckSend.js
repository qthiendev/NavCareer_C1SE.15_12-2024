const now = new Date();

module.exports.authCheckSend = async (req, res) => {
    try {
        res.status(200).json({
            message: 'Middleware checkAuth',
            session_status: req.session_status,
            auth_status: req.auth_status,
            authz_status: req.authz_status,
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at authCheckSend.js | Error >{${err.message}}<`);
        res.status(500).json({
            message: 'Error on request',
            time: now.toLocaleString()
        });
    }
};
