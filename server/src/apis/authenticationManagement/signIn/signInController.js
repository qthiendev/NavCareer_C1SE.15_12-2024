const { trySignIn } = require('./signInService');
const ncdb = require('../../databases/ncdbService');
const now = new Date();

const signIn = async (req, res) => {
    try {
        const { account, password } = req.body;

        if (!account)
            throw new Error(`'account' is empty.`);
        if (!password)
            throw new Error(`'password' is empty.`);

        if (req.session.username === account) {
            return res.status(200).json({
                message: 'Already signed in with this account.',
                time: now.toLocaleString()
            });
        }

        const data = await trySignIn('gst', account, password);

        if (!data || data == {}) {// Handle invalid credentials
            console.log(`[${now.toLocaleString()}] at signInController.js/signIn() | Invalid credentials {${account}, ${password}}`);
            return res.status(401).json({
                message: 'Invalid credentials.',
                time: now.toLocaleString()
            });
        }

        const { authentication_id, authorization_id } = data;

        const authorization = await ncdb.query('gst', `execute ReadAlias @authorization_id`, { authorization_id });

        //Set to connect.sid
        req.session.authentication = authentication_id;
        req.session.authorization = authorization[0].alias;

        console.log(`[${now.toLocaleString()}] at signInController.js/signIn() | Signed in successfully {${account}, ${password}}`);

        res.status(200).json({
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
