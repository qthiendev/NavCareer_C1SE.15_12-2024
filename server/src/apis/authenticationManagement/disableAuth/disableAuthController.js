const { tryDiableAuth } = require('./disableAuthService');
const now = new Date();

const disableAuth = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { password } = req.body;

        const result = await tryDiableAuth(role, aid, password);

        if (result) {
            req.session.destroy((err) => {
                if (err)
                    throw new Error(err.message);

                console.log(`[${now.toLocaleString()}] at disableAuthController.js/disableAuth | Disable authentication successfuly. {${aid}, ${role}}`);
            return res.status(200).json({
                message: 'Disable authentication successfuly.',
                time: now.toLocaleString()
            });
            });
        } else {
            console.log(`[${now.toLocaleString()}] at disableAuthController.js/disableAuth | Disable authentication failed. {${aid}, ${role}}`);
            return res.status(203).json({
                message: 'Disable authentication failed.',
                time: now.toLocaleString()
            });
        }

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at disableAuthController.js/disableAuth | ${err.message}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
}

module.exports = { disableAuth };