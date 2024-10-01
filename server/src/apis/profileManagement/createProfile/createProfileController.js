const { tryCreateProfile } = require('./createProfileService');

const createProfile = async (req, res) => {
    try {
        const { userType, userId, userName, email, birthdate, gender, phoneNumber, address, authenticationId } = req.body;

        // Validate required fields
        if (!userType || !userId || !userName || !email || !authenticationId) 
            throw new Error(`'userType', 'userId', 'userName', 'email', and 'authenticationId' are required fields.`);

        // Create profile in the service
        const createdProfile = await tryCreateProfile({ 
            userType, 
            userId, 
            userName, 
            email, 
            birthdate, 
            gender, 
            phoneNumber, 
            address, 
            authenticationId 
        });

        if (!createdProfile) 
            throw new Error(`Failed to create profile. Please try again.`);

        res.status(201).json(createdProfile);

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at createProfileController.js/createProfile() | {\n${err.message}\n}`);
        res.status(400).json({ message: err.message });
    }
};

module.exports = { createProfile };
