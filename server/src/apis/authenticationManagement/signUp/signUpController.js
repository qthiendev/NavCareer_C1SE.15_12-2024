const { trySignUp } = require('./signUpService');

// Validate input using regex
const isValidInput = (input) => /^[a-zA-Z0-9@._-]+$/.test(input);

const signUp = async (req, res) => {
    try {
        const {
            userType = '',
            account: rawAccount = '',
            password: rawPassword = '',
            email: rawEmail = '',
            authorization_id: rawAuthorizationId = ''
        } = req.query;

        const account = rawAccount.trim().replace(/\s/g, '') || null;
        const password = rawPassword.trim().replace(/\s/g, '') || null;
        const email = rawEmail.trim().replace(/\s/g, '') || null;
        const authorization_id = rawAuthorizationId.trim().replace(/\s/g, '') || null;

        if (!userType || userType.trim() === '')
            throw new Error(`'userType' is empty.`);

        if (!account)
            throw new Error(`'account' is empty or invalid.`);

        if (!password)
            throw new Error(`'password' is empty or invalid.`);

        if (!email)
            throw new Error(`'email' is empty or invalid.`);

        if (!authorization_id)
            throw new Error(`'authorization_id' is empty or invalid.`);

        // Ensure input only contains a-zA-Z, digits, and special chars (@._-)
        if (!isValidInput(account))
            throw new Error(`'account' contains invalid characters.`);

        if (!isValidInput(password))
            throw new Error(`'password' contains invalid characters.`);

        if (!isValidInput(email))
            throw new Error(`'email' contains invalid characters.`);

        if (!isValidInput(authorization_id))
            throw new Error(`'authorization_id' contains invalid characters.`);

        // Try to sign up the user
        const signUpSuccess = await trySignUp(userType.trim(), account, password, email, authorization_id);

        if (!signUpSuccess)
            throw new Error('Failed to sign up the account.');

        res.status(200).json({ message: 'Account signed up successfully.' });

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at signUpController.js/signUp() | {\n${err.message}\n}`);
        res.status(400).json({ message: err.message });
    }
};

module.exports = { signUp };
