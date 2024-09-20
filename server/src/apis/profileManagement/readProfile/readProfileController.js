const { tryReadProfile } = require('./readProfileService');

const readProfile = async (req, res) => {
    try {
        const {
            userType,
            index
        } = req.query;

        if (!userType || userType === '')
            throw new Error(`'userType' is empty.`);

        if (!index || index === '')
            throw new Error(`   'index' is empty.`);

        data = await tryReadProfile(userType, index);

        res.json(data);

    } catch (err) {
        const now = new Date();
        console.log(`[${now.toLocaleString()}] at signInController.js/signIn() | {\n${err.message}\n}`);
        res.status(400).json({ message: err.message });
    }
};

module.exports = { readProfile };