const { tryCreateProfile } = require('./createProfileService');
const now = new Date();

const createProfile = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { 
            userFullName, 
            email, 
            birthdate, 
            gender, 
            phoneNumber, 
            address } = req.body;

        // Validate required fields
        if (!userFullName || !email || !birthdate || !gender || !phoneNumber || !address) {
            throw new Error('missing elements');
        }

        // Prepare profile data
        const profileData = {
            aid, 
            role,
            userFullName: userFullName,
            birthdate: birthdate,
            gender: gender,
            email: email,
            phoneNumber: phoneNumber,
            address: address || 'N/A',  // Set default if address is null or undefined
        };

        // Create profile in the service
        const createdProfile = await tryCreateProfile(profileData);
        if (createdProfile) {
            console.log(`[${now.toLocaleString()}] at createProfileController.js/createProfile() | Profile created successfully!`);
            return res.status(200).json({
                message: 'Profile created successfully!',
                create_status: false
            });
        } else {
            console.error(`[${now.toLocaleString()}] at createProfileController.js/createProfile() | Profile failed to create!`);
            return res.status(201).json({
                message: 'Profile failed to create!',
                create_status: false
            });
        }
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at createProfileController.js/createProfile() | ${err.message}`);
        res.status(500).json({
            message: 'Failed to create profile. Please try again.',
            create_status: false
        });
    }
};

module.exports = { createProfile };
