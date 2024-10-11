const { tryUpdateProfile } = require('./updateProfileService');

const updateProfile = async (req, res) => {
    try {
        const { userType, userId,userFullName, email, birthdate, gender, phoneNumber, address } = req.body;
        // Validate required fields
        if (!userType || !userId) 
            throw new Error(`'userType' and 'userId' are required fields.`);

        // Update the profile in the service
        const profileData ={ 
            userType: req.session.authorization || 'gst',  // Fallback if session data is missing
            userId: userId, 
            userFullName: userFullName,
            birthdate: birthdate,
            gender: gender,
            email: email,
            phoneNumber: phoneNumber,
            address: address || 'N/A', 
            authenticationId: req.session.authentication || 'defaultAuthenticationId' 
        };

        const updateProfile = await tryUpdateProfile(profileData);
        if (Number.parseInt(updateProfile) === 1) {
            console.error(`[${now.toLocaleString()}] at createProfileController.js/createProfile() | Profile failed to create!`);
            return res.status(400).json({
                message: 'Profile failed to create!',
                create_status: false
            });
        }

        if (Number.parseInt(updateProfile) === 3) {
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

module.exports = { updateProfile };
