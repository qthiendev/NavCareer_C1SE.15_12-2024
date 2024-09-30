const { trySignUp } = require('./signUpService');
const now = new Date();

const signUp = async (req, res) => {
    try {
        const {
            account,
            password,
            email,
            authorization_id,
        } = req.body;

        if (typeof(account) == 'undefined' || account == null)
            throw new Error(`'account' is empty or invalid.`);

        if (typeof(password) == 'undefined' || password == null)
            throw new Error(`'password' is empty or invalid.`);

        if (typeof(email) == 'undefined' || email == null)
            throw new Error(`'email' is empty or invalid.`);

        if (typeof(authorization_id) == 'undefined' || authorization_id == null)
            throw new Error(`'authorization_id' is empty or invalid.`);

        const signUpStatus = await trySignUp(account, password, email, authorization_id);

        res.status(200).json({
            message: `Account signed up${signUpStatus ? '' : ' not' } successfully.`,
            sign_up_status: signUpStatus,
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at signUpController.js/signUp() | Error >{${err.message}}<`);
        res.status(400).json({ 
            message: 'Failed to sign up the account.',
            sign_up_status: false,
            time: now.toLocaleString()
        });
    }
};

module.exports = { signUp };
