module.exports.check = async (req, res, next) => {
    const now = new Date();

    try {
        const { authentication, authorization } = req.session;

        const authCheck = authentication != null && typeof(authentication) != 'undefined';
        const authzCheck = authorization && authorization != '';

        if (!authCheck || !authzCheck) {
            return res.status(401).json({
                message: 'Not signed in.',
                time: now.toLocaleString(),
            });
        }

        req.username = username
        next();

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at authCheck.js | Error >{${err.message}}<`);
        res.status(500).json({
            message: 'Error on request',
            time: now.toLocaleString(),
        });
    }
};