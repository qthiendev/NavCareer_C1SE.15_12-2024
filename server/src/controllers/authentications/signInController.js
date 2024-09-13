const { signInService } = require("../../services/authentications/signInService");

const signIn = async (req, res) => {
    try {
        const { account, password } = req.query;
        console.log(`</> Account: '${account}', Password '${password}'.`);
        const result = await signInService(account, password);
        res.json({ isUser: result && result.length > 0});
    } catch (err) {
        console.error("<!> Error querying user credentials.");
        console.error("<!>", err);
        res.status(500).json({ error: 'An error occurred while signing in.' });
    }
};

module.exports = { signIn };