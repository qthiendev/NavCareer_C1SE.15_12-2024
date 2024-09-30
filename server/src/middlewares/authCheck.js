const now = new Date();

module.exports.authCheck = async (req, res, next) => {
    try {  
        const {
            auth_id,
            authz_id
        } = req.session; // Take the auths id from cookie

        const {
            criteria_auth_id,
            criteria_authz_id
        } = req.query; // Take the criteria of auths id from query

        //Parse to int 'cause if any of them is 0, JS will understand it's false, so stupid

        const sc_undefined_check = typeof(auth_id) !== 'undefined' && typeof(authz_id) !== 'undefined';
        const sc_null_check =Number.parseInt(auth_id) !== null && Number.parseInt(authz_id) !== null;
        const sc = sc_undefined_check && sc_null_check; // session check

        const ac = typeof(criteria_auth_id) !== 'undefined' && criteria_auth_id !== null; // criteria_auth_id check
        const azc = typeof(criteria_authz_id) !== 'undefined' && criteria_authz_id !== null; // criteria_authz_id check

        const auth_status = (sc && ac && Number.parseInt(criteria_auth_id) === Number.parseInt(auth_id));
        const authz_status = (sc && azc && Number.parseInt(criteria_authz_id) === Number.parseInt(authz_id));

        //console.log(`[${now.toLocaleString()}] at authCheck.js | auth_id: ${auth_id}, authz_id: ${authz_id}, criteria_auth_id: ${criteria_auth_id}, criteria_authz_id: ${criteria_authz_id},`);

        req.session_status = sc;
        req.auth_status = auth_status;
        req.authz_status = authz_status;

        next();

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at authCheck.js | Error >{${err.message}}<`);
        res.status(500).json({
            message: 'Error on request',
            time: now.toLocaleString()
        });
    }
};
