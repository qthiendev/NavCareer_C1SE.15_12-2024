const now = new Date();
require('dotenv').config();

const isSignedIn = async (req, res, next) => {
    try {
        if (Number.isNaN(Number.parseInt(req.session.aid))) {
            console.warn(`[${now.toLocaleString()}] at authentication.js/isSignedIn | auth[${req.session.aid}], role[${req.session.role}], user[${req.session.uid}] triggred`);
            return res.status(203).json({
                message: 'Must Sign In to Access.',
                sign_in_status: false,
                time: now.toLocaleString(),
            });
        }

        next();

    } catch (err) {
        console.error(`[${now.toLocaleString()}] authentication.js/isSignedIn | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString(),
        });
    }
};

const isNotSignedIn = async (req, res, next) => {
    try {
        if (!Number.isNaN(Number.parseInt(req.session.aid))) {
            console.warn(`[${now.toLocaleString()}] at authentication.js/isNotSignedIn | auth[${req.session.aid}], role[${req.session.role}], user[${req.session.uid}] triggred`);
            return res.status(203).json({
                message: 'Must Not Sign In to Access.',
                sign_in_status: true,
                time: now.toLocaleString(),
            });
        }

        next();

    } catch (err) {
        console.error(`[${now.toLocaleString()}] authentication.js/isNotSignedIn | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString(),
        });
    }
};

module.exports = { isSignedIn, isNotSignedIn };
