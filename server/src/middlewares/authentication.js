const isSignedIn = async (req, res, next) => { // Pass when user already signed in
    const now = new Date();

    try {
        const { aid, role } = req.session;

        const idCheck = aid != null && typeof (aid) !== 'undefined';
        const roleCheck = role && role !== '';

        if (idCheck ^ roleCheck)
            throw new Error(`There is trouble with the session: ${aid}, ${role}`);

        if (!idCheck && !roleCheck) {
            console.log(`[${now.toLocaleString()}] at authentication.js/isSignedIn | Triggered`);
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

const isNotSignedIn = async (req, res, next) => { // Pass when user not sign in yet
    const now = new Date();

    try {
        const { aid, role } = req.session;

        const idCheck = aid != null && typeof (aid) !== 'undefined';
        const roleCheck = role && role !== '';

        if (idCheck ^ roleCheck)
            throw new Error(`There is trouble with the session: ${aid}, ${role}`);

        if (idCheck && roleCheck) {
            console.error(`[${now.toLocaleString()}] at authentication.js/isNotSignedIn | Triggered`);
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
