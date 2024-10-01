const { tryUpdateAuthentication } = require('./updateAuthenticationService');
const now = new Date();

const updateAuthentication = async (req, res) => {
    try {
        const {
            current_password,
            new_password,
            identifier_email,
            authorization_id
        } = req.body;

        const {
            username,
            auth_id,
            authz_id,
            authorization
        } = req.session;

        // Call the service to try editing the auth
        const editStatus = await tryUpdateAuthentication(
            authorization,
            auth_id,
            username,
            current_password,
            new_password,
            identifier_email,
            authz_id,
            authorization_id
        );

        console.log(`[${now.toLocaleString()}] at editAuthController.js/editAuth() | Account edited${editStatus ? '' : ' not'} successfully.`);

        res.status(200).json({
            message: `Account edited${editStatus ? '' : ' not'} successfully.`,
            edit_status: editStatus,
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at editAuthController.js/editAuth() | ${err.message}`);
        res.status(400).json({
            message: 'Failed to edit the account.',
            edit_status: false,
            time: now.toLocaleString()
        });
    }
}

module.exports = { updateAuthentication };