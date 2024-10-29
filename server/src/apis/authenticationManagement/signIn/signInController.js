const { trySignIn } = require('./signInService');
const now = new Date();

const signIn = async (req, res) => {
    try {
        //console.log(req.session, '\n', req.body)

        const { account, password } = req.body;
        const { role } = req.session;

        if (!role)
            throw new Error(`'role' must be provided.`);

        if (!account)
            throw new Error(`'account' must be provided.`);

        if (!password)
            throw new Error(`'password' must be provided.`);

        const data = await trySignIn(role, account, password);

        if (!data)
            throw new Error('Query failed');

        if(data.check === 'INACTIVE') {
            console.warn(`[${now.toLocaleString()}] at signInController.js/signIn | Invalid credentials {${account}, ${password}}`);
            return res.status(403).json({
                message: 'Invalid or inactive credentials.',
                time: now.toLocaleString()
            });
        }

        req.session.aid = data.authentication_id;
        req.session.role = data.role;
        req.session.uid = data.user_id;

        const logSt = `Signed in successfully {${account}, ${password}} => auth[${data.authentication_id}], role[${data.role}], user[${data.user_id}]`;

        console.log(`[${now.toLocaleString()}] at signInController.js/signIn | ${logSt}`);
        res.status(200).json({
            message: `Signed in successfully.`,
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
