const { tryDeleteProfile } = require('./deleteProfileService');
const now = new Date();

const deleteProfile = async (req, res) => {
    try {
        const { user_id } = req.query;
        const { role } = req.session;

        if (!role)
            throw new Error(`'role' is required.`);

        if (user_id === null || typeof(user_id) === 'undefined')
            throw new Error(`'index' is required.`);

        const data = await tryDeleteProfile(role, user_id);

        if (!data) {
            console.log(`[${now.toLocaleString()}] at data deleteProfileController.js/deleteProfile() | Profile '${user_id}' not found`);
            return res.status(203).json({
                message: `Profile '${user_id}' not found`,
                time: now.toLocaleString()
            });
        }

        return res.status(200).json(data);

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at cache deleteProfileController.js/deleteProfile() | ${err.message}`);
        res.status(500).json({ 
            message: 'Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { deleteProfile };
