const { tryUpdateAuth } = require('./updateAuthService');
const now = new Date();

const updateAuth= async (req, res) => {
    try {
        const {
            new_account,
            current_password,
            new_password,
            new_identifier_email,
            new_authz_id
        } = req.body;

        const { aid, role } = req.session;

        // Call the service to try editing the auth
        const editStatus = await tryUpdateAuthentication(
            role,
            aid,
            new_account,
            current_password,
            new_password,
            new_identifier_email,
            new_authz_id
        );

        console.log(`[${now.toLocaleString()}] at editAuthController.js/editAuth() | Account edited${editStatus ? '' : ' not'} successfully.`);

        res.status(editStatus ? 200 : 204).json({
            message: `Account edited${editStatus ? '' : ' not'} successfully.`,
            edit_status: editStatus,
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at editAuthController.js/editAuth() | ${err.message}`);
        res.status(400).json({
            message: 'Internal Server Error',
            edit_status: false,
            time: now.toLocaleString()
        });
    }
}

module.exports = { updateAuth };