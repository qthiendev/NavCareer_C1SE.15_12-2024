const { trySignIn } = require('./signInService');
const now = new Date();

const signIn = async (req, res) => {
    try {
        const { account, password } = req.body;

        if (!account)
            throw new Error(`'account' is empty.`);
        if (!password)
            throw new Error(`'password' is empty.`);

        const data = await trySignIn(account, password);

        if (!data || data == {}) {// Handle invalid credentials
            console.log(`[${now.toLocaleString()}] at signInController.js/signIn() | Invalid credentials {${account}, ${password}}`);
            return res.status(200).json({
                message: 'Invalid credentials.',
                signed_in: false,
                time: now.toLocaleString()
            });
        }

        const {
            authentication_id,
            authorization_id
        } = data;

        if (req.session.auth_id === authentication_id
            && req.session.authz_id === authorization_id) {
            return res.status(200).json({
                message: 'Already signed in with this account.',
                signed_in: true,
                time: now.toLocaleString()
            });
        }

        //Set to connect.sid
        req.session.auth_id = authentication_id;
        req.session.authz_id = authorization_id;
        req.session.username = account;

        console.log(`[${now.toLocaleString()}] at signInController.js/signIn() | Signed in successfully {${account}, ${password}}`);

        res.status(200).json({
            message: 'Signed in successfully.',
            signed_in: true,
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at signInController.js/signIn() | Error >{${err.message}}<`);
        res.status(500).json({
            message: 'Error on request',
            signed_in: false,
            time: now.toLocaleString()
        });
    }
};

module.exports = { signIn };
