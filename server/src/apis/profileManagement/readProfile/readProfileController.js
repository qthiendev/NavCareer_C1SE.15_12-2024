const { tryReadProfile } = require('./readProfileService');
const now = new Date();

const readProfile = async (req, res) => {
    try {
        const { user_id } = req.query;
        const { role } = req.session;

        if (!role)
            throw new Error(`'role' is required.`);

        if (user_id === null || typeof(user_id) === 'undefined')
            throw new Error(`'index' is required.`);

        const data = await tryReadProfile(role, user_id);

        if (!data) {
            console.log(`[${now.toLocaleString()}]!data at readProfileController.js/readProfile() | Profile '${user_id}' not found`);
            return res.status(203).json({
                message: `Profile '${user_id}' not found`,
                time: now.toLocaleString()
            });
        }

        return res.status(200).json(data);

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] cache at readProfileController.js/readProfile() | ${err.message}`);
        res.status(500).json({ 
            message: 'Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { readProfile };
