const { tryModifyUser } = require('./modifyUserService');
const now = new Date();

const modifyUser = async (req, res) => {
    try {
        const {
            authentication_id,
            account,
            password,
            identifier_email,
            authorization_id,
            auth_status,
            user_full_name,
            birthdate,
            gender,
            email,
            phone_number,
            address,
            user_status
        } = req.body;

        if (
            Number.isNaN(authentication_id) ||
            !account ||
            !password ||
            !identifier_email ||
            Number.isNaN(authorization_id) ||
            Number.isNaN(auth_status) ||
            !user_full_name ||
            !birthdate ||
            Number.isNaN(gender) ||
            !email ||
            !phone_number ||
            !address ||
            Number.isNaN(user_status)
        ) {
            return res.status(203).json({
                message: 'Missing required fields.',
            });
        }

        const profileData = {
            authentication_id,
            account,
            password,
            identifier_email,
            authorization_id,
            auth_status,
            user_full_name,
            birthdate,
            gender,
            email,
            phone_number,
            address,
            user_status
        };

        const { role } = req.session;

        const result = await tryModifyUser(role, profileData);

        if (result) {
            console.log(`[${now.toLocaleString()}] at modifyUserController.js/modifyUser | User ${authentication_id} modified successfully.`);
            return res.status(200).json({
                message: `User ${authentication_id} modified successfully.`,
                time: now.toLocaleString()
            });
        } else {
            console.error(`[${now.toLocaleString()}] tại modifyUserController.js/modifyUser | User ${authentication_id} failed to modify.`);
            return res.status(203).json({
                message: `User ${authentication_id} failed to modify.`,
                time: now.toLocaleString()

            });
        }

    } catch (err) {
        console.error(`[${now.toLocaleString()}] tại modifyUserController.js/modifyUser | ${err.message}`);
        res.status(500).json({
            message: `Server Error`,
            time: now.toLocaleString()
        });
    }
}

module.exports = { modifyUser }