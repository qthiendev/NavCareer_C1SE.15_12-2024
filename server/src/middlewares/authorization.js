const checkAuthorization = (requiredRole) => async (req, res, next) => {
    try {
        const now = new Date();

        const { aid, role } = req.session;

        const aidCheck = aid != null && typeof(aid) !== 'undefined';
        const roleCheck = role && role !== '';

        if (aidCheck ^ roleCheck)
            throw new Error('There is trouble with the session:', id, role);
        
        if (role !== requiredRole) {
            console.log(`[${now.toLocaleString()}] at authorization.js/checkAuthorization | Triggered at ${requiredRole}`);
            return res.status(403).json({
                message: 'Permission Denied',
                time: now.toLocaleString()
            });
        }

        next();
    } catch (err) {
        console.error(`[${now.toLocaleString()}] authorization.js/checkAuthorization | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
};

const student = checkAuthorization('NAV_STUDENT');
const esp = checkAuthorization('NAV_ESP');
const admin = checkAuthorization('NAV_ADMIN');

module.exports = { admin, esp, student };
