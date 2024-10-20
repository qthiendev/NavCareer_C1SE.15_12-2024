const { tryUpdateAuth } = require('./updateAuthService');
const now = new Date();

const updateAuth = async (req, res) => {
    try {
        const {
            new_account,
            current_password,
            new_password,
            new_identifier_email
        } = req.body;

        const { aid, role } = req.session;

        // Validate inputs
        if (!new_account) 
            throw new Error(`'new_account' is empty or invalid.`);

        if (!current_password) 
            throw new Error(`'current_password' is empty or invalid.`);

        if (!new_password) 
            throw new Error(`'new_password' is empty or invalid.`);

        if (!new_identifier_email) 
            throw new Error(`'new_identifier_email' is empty or invalid.`);

        if (!aid || Number.isNaN(Number.parseInt(aid)) || Number.parseInt(aid) === 0)
            throw new Error(`'aid' is empty or invalid.`);

        if (!role) 
            throw new Error(`'role' is empty or invalid.`);

        const editStatus = await tryUpdateAuth(role, aid, new_account, current_password, new_password, new_identifier_email);

        if (editStatus === 'SUCCESSED') {
            req.session.destroy((err) => {
                if (err)
                    throw new Error(err.message);

                console.log(`[${now.toLocaleString()}] at editAuthController.js/editAuth | Account edited successfully. Session ended.`);
                return res.status(200).json({
                    message: 'Account edited successfully. Session ended.',
                    edit_status: true,
                    time: now.toLocaleString()
                });
            });
        } else {
            console.log(`[${now.toLocaleString()}] at editAuthController.js/editAuth | Account edit was not successful.`);
            return res.status(203).json({
                message: 'Account edit was not successful.',
                edit_status: false,
                time: now.toLocaleString()
            });
        }

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at editAuthController.js/editAuth | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            edit_status: false,
            time: now.toLocaleString()
        });
    }
};

module.exports = { updateAuth };
