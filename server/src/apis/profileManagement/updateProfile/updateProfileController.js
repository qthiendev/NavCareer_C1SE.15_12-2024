const { tryUpdateProfile } = require('./updateProfileService');

const updateProfile = async (req, res) => {
    try {
        const { userType, userId } = req.body;
        const { userName, email, birthdate, gender, phoneNumber, address } = req.body;

        // Validate required fields
        if (!userType || !userId) 
            throw new Error(`'userType' and 'userId' are required fields.`);

        // Update the profile in the service
        const updatedProfile = await tryUpdateProfile({ 
            userType, 
            userId, 
            userName, 
            email, 
            birthdate, 
            gender, 
            phoneNumber, 
            address 
        });

        if (!updatedProfile) 
            throw new Error(`Failed to update profile. Profile may not exist.`);

        res.status(200).json(updatedProfile);

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at updateProfileController.js/updateProfile() | {\n${err.message}\n}`);
        res.status(400).json({ message: err.message });
    }
};

module.exports = { updateProfile };
