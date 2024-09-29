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
            return res.status(401).json({
                message: 'Invalid credentials.',
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
                time: now.toLocaleString()
            });
        }

        //Set to connect.sid
        req.session.auth_id = authentication_id;
        req.session.authz_id = authorization_id;

        console.log(`[${now.toLocaleString()}] at signInController.js/signIn() | Signed in successfully {${account}, ${password}}`);

        res.json({
            message: 'Signed in successfully.',
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at signInController.js/signIn() | Error >{${err.message}}<`);
        res.status(500).json({
            message: 'Error on request',
            time: now.toLocaleString()
        });
    }
};

module.exports = { signIn };
