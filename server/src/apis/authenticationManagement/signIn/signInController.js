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

        const data = await trySignIn('GST', account, password);

        if (!data || data == {}) {// Handle invalid credentials
            console.log(`[${now.toLocaleString()}] at signInController.js/signIn() | Invalid credentials {${account}, ${password}}`);
            return res.status(203).json({
                message: 'Failed to signed in.',
                time: now.toLocaleString()
            });
        }

        const { aid, role } = data;

        if (req.session.aid === aid) {
            console.log(`[${now.toLocaleString()}] at signInController.js/signIn() | Already signed in {${account}, ${password}}`);
            return res.status(201).json({
                message: `Already signed in.`,
                time: now.toLocaleString()
            });
        }

        //Set to connect.sid
        req.session.aid = aid;
        req.session.role = role;

        console.log(`[${now.toLocaleString()}] at signInController.js/signIn() | Signed in successfully {${account}, ${password}}`);
        res.status(200).json({
            message: 'Signed in successfully.',
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at signInController.js/signIn() | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { signIn };
