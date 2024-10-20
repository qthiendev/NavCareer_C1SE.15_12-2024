const { trySignIn } = require('./signInService');
const now = new Date();

const signIn = async (req, res) => {
    try {
        const { account, password } = req.body;
        const { role } = req.session;

        if (!account)
            throw new Error(`'account' is empty.`);
        if (!password)
            throw new Error(`'password' is empty.`);

        const data = await trySignIn(role, account, password);
        const { q_aid, q_role } = data;

        if (q_aid === null) {
            console.log(`[${now.toLocaleString()}] at signInController.js/signIn | Invalid credentials {${account}, ${password}}`);
            req.session.role = q_role;
            return res.status(203).json({
                message: 'Failed to signed in.',
                time: now.toLocaleString()
            });
        }

        if (req.session.aid === q_aid) {
            console.log(`[${now.toLocaleString()}] at signInController.js/signIn | Already signed in {${account}, ${password}}`);
            return res.status(201).json({
                message: `Already signed in.`,
                time: now.toLocaleString()
            });
        }

        //Set to connect.sid
        req.session.aid = q_aid;
        req.session.role = q_role;

        console.log(`[${now.toLocaleString()}] at signInController.js/signIn | Signed in successfully {${account}, ${password}}`);
        res.status(200).json({
            message: 'Signed in successfully.',
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at signInController.js/signIn | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { signIn };
