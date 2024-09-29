module.exports.authCheck = (req, res, next) => {
    try {
        const now = new Date();
        if (Number.isInteger(req.session.auth_id) && Number.isInteger(req.session.authz_id)) {
            res.status(200).json({
                message: 'Passed AuthCheck Middleware',
                authenticated: true,
                time: now.toLocaleString()
            })
            next();
        } else {
            res.status(200).json({
                message: 'Denined AuthCheck Middleware',
                authenticated: false,
                time: now.toLocaleString()
            });
        }
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at authCheck.js | Error >{${err.message}}<`);
        res.status(500).json({
            message: 'Error on request',
            time: now.toLocaleString()
        });
    }
};
