const { tryUpdateProfile } = require('./updateProfileService');
const now = new Date();

const updateProfile = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { userid, 
            userFullName, 
            email, 
            birthdate, 
            gender, 
            phoneNumber, 
            address } = req.body;
            // Validate required fields
        if (!userid ||!userFullName || !email || !birthdate || !gender || !phoneNumber || !address) {
            throw new Error('missing elements');
        }
        // Update the profile in the service
        const profileData ={ 
            aid,
            role,
            userid: userid,
            userFullName: userFullName,
            birthdate: birthdate,
            gender: gender,
            email: email,
            phoneNumber: phoneNumber,
            address: address || 'N/A', 
        };

        const updatedProfile = await tryUpdateProfile(profileData);
        if (updatedProfile) {
            console.log(`[${now.toLocaleString()}] at updateProfileController.js/updateProfile() | Profile update successfully!`);
            return res.status(200).json({
                message: 'Profile update successfully!',
                create_status: false
            });
        } else {
            console.error(`[${now.toLocaleString()}] at updateProfileController.js/updateProfile() | Profile failed to update!`);
            return res.status(201).json({
                message: 'Profile failed to update!',
                create_status: false
            });
        }
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at updateProfileController.js/updateProfile() | ${err.message}`);
        res.status(500).json({
            message: 'Failed to update profile. Please try again.',
            create_status: false
        });
    }
};

module.exports = { updateProfile };
