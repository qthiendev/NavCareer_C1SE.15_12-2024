const { trySignIn } = require('./signInService');

const signIn = async (req, res) => {
    try {
        const {
            userType,
            account,
            password
        } = req.query;

        if (!userType || userType === '')
            throw new Error(`'userType' is empty.`);

        if (!account || account === '')
            throw new Error(`'account' is empty.`);

        if (!password || password === '')
            throw new Error(`'password' is empty.`);

        data = await trySignIn(userType, account, password);

        res.json(data);

    } catch (err) {
        const now = new Date();
        console.log(`[${now.toLocaleString()}] at signInController.js/signIn() | {\n${err.message}\n}`);
        res.status(400).json({ message: err.message });
    }
}

module.exports = { signIn };