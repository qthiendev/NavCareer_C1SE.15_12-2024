const { tryReadProfile } = require('./readProfileService');

const readProfile = async (req, res) => {
    try {
        const { userType, index } = req.query;

        if (!userType) 
            throw new Error(`'userType' is required.`);

        if (!index) 
            throw new Error(`'index' is required.`);

        const data = await tryReadProfile(userType, index);

        if (!data) 
            throw new Error(`No profile found for the given index.`);

        res.status(200).json(data);

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at readProfileController.js/readProfile() | {\n${err.message}\n}`);
        res.status(400).json({ message: err.message });
    }
};

module.exports = { readProfile };
