const { tryModifyUser } = require('./modifyUserService');
const now = new Date();

const modifyUser = async (req, res) => {
    try {
        // Destructure required fields from the request body
        const {
            authentication_id,
            account,
            password,
            identifier_email,
            authorization_id,
            auth_status,
            user_full_name,
            user_alias,
            user_bio,
            user_birthdate,
            user_gender,
            user_email,
            user_phone_number,
            user_address,
            user_status
        } = req.body;

        // Validate required fields
        const requiredFields = [
            authentication_id,
            account,
            password,
            identifier_email,
            authorization_id,
            auth_status,
            user_full_name,
            user_birthdate,
            user_gender,
            user_email,
            user_phone_number,
            user_address,
            user_status
        ];

        if (requiredFields.some(field => field === undefined || field === null || field === '')) {
            return res.status(400).json({
                message: 'Missing required fields.',
            });
        }

        // Prepare the profile data object
        const profileData = {
            authentication_id,
            account,
            password,
            identifier_email,
            authorization_id,
            auth_status: auth_status, // Ensure it's treated as a boolean
            user_full_name,
            user_alias,
            user_bio,
            user_birthdate,
            user_gender: user_gender, // Ensure it's treated as a boolean
            user_email,
            user_phone_number,
            user_address,
            user_status: user_status // Ensure it's treated as a boolean
        };

        const { role } = req.session;

        // Attempt to modify the user
        const result = await tryModifyUser(role, profileData);

        // Check the result and send appropriate response
        if (result) {
            console.log(`[${now.toLocaleString()}] at modifyUserController.js/modifyUser | User ${authentication_id} modified successfully.`);
            return res.status(200).json({
                message: `User ${authentication_id} modified successfully.`,
                time: now.toLocaleString()
            });
        } else {
            console.error(`[${now.toLocaleString()}] at modifyUserController.js/modifyUser | User ${authentication_id} failed to modify.`);
            return res.status(400).json({
                message: `User ${authentication_id} failed to modify.`,
                time: now.toLocaleString()
            });
        }

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at modifyUserController.js/modifyUser | ${err.message}`);
        res.status(500).json({
            message: 'Server Error',
            time: now.toLocaleString()
        });
    }
}

module.exports = { modifyUser };
