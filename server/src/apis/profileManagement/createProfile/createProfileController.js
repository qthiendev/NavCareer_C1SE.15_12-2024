const { tryCreateProfile } = require('./createProfileService');
const now = new Date();

const createProfile = async (req, res) => {
    try {
        const { userFullName, email, birthdate, gender, phoneNumber, address } = req.body;

        // Validate required fields
        if (!userFullName || !email || !birthdate || !gender || !phoneNumber || !address) {
            return res.status(400).json({
                message: 'Missing required fields',
                create_status: false
            });
        }

        // Prepare profile data
        const profileData = {
            userType: req.session.authorization || 'gst',  // Fallback if session data is missing
            userFullName: userFullName,
            birthdate: birthdate,
            gender: gender,
            email: email,
            phoneNumber: phoneNumber,
            address: address || 'N/A',  // Set default if address is null or undefined
            authenticationId: req.session.authentication || 'defaultAuthenticationId'  // Fallback if session is missing
        };

        // Create profile in the service
        const createdProfile = await tryCreateProfile(profileData);
        if (Number.parseInt(createdProfile) === 1) {
            console.error(`[${now.toLocaleString()}] at createProfileController.js/createProfile() | Profile failed to create!`);
            return res.status(400).json({
                message: 'Profile failed to create!',
                create_status: false
            });
        }

        if (Number.parseInt(createdProfile) === 3) {
            return res.status(201).json({
                message: 'Profile already exists!',
                create_status: false
            });
        }

        console.log(`[${now.toLocaleString()}] at createProfileController.js/createProfile() | Profile created successfully!`);
        return res.status(200).json({
            message: 'Profile created successfully!',
            create_status: true
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at createProfileController.js/createProfile() | ${err.message}`);
        res.status(500).json({
            message: 'Failed to create profile. Please try again.',
            create_status: false
        });
    }
};

module.exports = { createProfile };
