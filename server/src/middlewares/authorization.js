const checkAuthorization = (requiredRole) => async (req, res, next) => {
    try {
        const { authorization } = req.session;
        const now = new Date();
        
        if (authorization !== requiredRole) {
            return res.status(401).json({
                message: 'Not allowed',
                time: now.toLocaleString()
            });
        }

        next();
    } catch (err) {
        console.error(`[${now.toLocaleString()}] authorization.js/checkAuthorization() | ${err.message}`);
        res.status(500).json({
            message: 'Error on request',
            time: new Date().toLocaleString()
        });
    }
};

const student = checkAuthorization('std');
const esp = checkAuthorization('esp');
const admin = checkAuthorization('adm');

module.exports = { admin, esp, student };
