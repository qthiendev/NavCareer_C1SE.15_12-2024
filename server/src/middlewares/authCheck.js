const now = new Date();

module.exports.authCheck = async (req, res, next) => {
    try {
        const { auth_id, authz_id, username } = req.session; // Take the auths id from cookie
        console.log(req.session)

        const sc_undefined_check = typeof(auth_id) !== 'undefined' && typeof(authz_id) !== 'undefined';
        const sc_null_check = Number.parseInt(auth_id) !== null && Number.parseInt(authz_id) !== null;
        const sc = sc_undefined_check && sc_null_check;

        if (!sc) {
            req.session_status = false;
            return res.status(200).json({
                message: 'You are not signed in yet.',
                time: now.toLocaleString()
            });
        }

        req.session_status = true;
        req.auth_id = auth_id;
        req.authz_id = authz_id;
        req.username = username;
        next();

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at authCheck.js | Error >{${err.message}}<`);
        res.status(500).json({
            message: 'Error on request',
            time: now.toLocaleString()
        });
    }
};
