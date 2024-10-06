const { trySignUp } = require('./signUpService');
const now = new Date();

const signUp = async (req, res) => {
    try {
        const { account, password, email, authz_id } = req.body;

        const { role } = req.session

        if (typeof (account) == 'undefined' || account === null)
            throw new Error(`'account' is empty or invalid.`);

        if (typeof (password) == 'undefined' || password === null)
            throw new Error(`'password' is empty or invalid.`);

        if (typeof (email) == 'undefined' || email === null)
            throw new Error(`'email' is empty or invalid.`);

        if (typeof (authz_id) == 'undefined' || authz_id === null || Number.parseInt(authz_id) === 0)
            throw new Error(`'authz_id' is empty or invalid.`);

        const signUpStatus = await trySignUp(role, account, password, email, authz_id);

        if (signUpStatus === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at signUpController.js/signUp | Authentication information created successfully.`);
            return res.status(200).json({
                message: `Authentication information created successfully.`,
                time: now.toLocaleString()
            });
        }

        if (signUpStatus === 'FAILED') {
            console.error(`[${now.toLocaleString()}] at signUpController.js/signUp | Failed to created Authentication.`);
            return res.status(203).json({
                message: `Failed to create Authentication information.`,
                time: now.toLocaleString()
            });
        }

        if (signUpStatus === 'EXISTED') {
            console.error(`[${now.toLocaleString()}] at signUpController.js/signUp | Authentication already existed.`);
            return res.status(201).json({
                message: `Authentication information already existed.`,
                time: now.toLocaleString()
            });
        }

        throw new Error(`Cannot handle respone ${signUpStatus}`);

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at signUpController.js/signUp | ${err.message}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { signUp };
