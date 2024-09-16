const { getProfileService } = require("../../services/accountManagement/profileService");

const getProfile = async (req, res) => {
    try {
        const { AUTHENTICATION_ID } = req.query;

        console.log(`</> AUTHENTICATION_ID: '${AUTHENTICATION_ID}'.`);
        const result = await getProfileService(AUTHENTICATION_ID);
        res.json(result[0]);

    } catch (err) {
        console.error("<!> Error querying user profile.");
        console.error("<!>", err);
        res.status(500).json({ error: 'An error occurred while fetching the user profile.' });
    }
};

module.exports = { getProfile };
