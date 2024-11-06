const { tryUpdateProfile } = require('./updateProfileService');
const now = new Date();

const updateProfile = async (req, res) => {
    try {
        const { aid, role } = req.session;

        const {
            user_full_name, 
            user_alias,
            user_bio,
            user_birthdate, 
            user_gender, 
            user_email, 
            user_phone_number, 
            user_address, 
            user_status,
            avatar, // send at base64
        } = req.body;

        if (!user_full_name
            || !user_alias
            || !user_birthdate
            || Number.isNaN(user_gender)
            || !user_email
            || !user_phone_number
            || !user_address
            || Number.isNaN(user_status)) {
            throw new Error('missing elements', user_full_name, user_alias, user_bio, user_birthdate, user_gender, user_email, user_phone_number, user_address, user_status);
        }

        const result = await tryUpdateProfile(aid, role, user_full_name, 
            user_alias,
            user_bio,
            user_birthdate, 
            user_gender, 
            user_email, 
            user_phone_number, 
            user_address, 
            user_status);
    
        if (result === 'U_AID') {
            console.error(`[${now.toLocaleString()}] at updateProfileController.js/updateProfile | Authentication ${aid} not exist.`);
            return res.status(403).json({
                message: `Authentication ${aid} not exist.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now.toLocaleString()}] at updateProfileController.js/updateProfile | User not exist.`);
            return res.status(403).json({
                message: `User not exist.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at updateProfileController.js/updateProfile | Profile updated succesfuly.`);
            return res.status(200).json({
                message: `Profile updated succesfuly.`,
                time: now.toLocaleString()
            });
        }

        console.log(`[${now.toLocaleString()}] at updateProfileController.js/updateProfile | Profile failed to update.`);
        return res.status(203).json({
            message: `Profile failed to update.`,
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] tại updateProfileController.js/updateProfile() | ${err.message}`);
        res.status(500).json({
            message: 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.',
            update_status: false
        });
    }
};

module.exports = { updateProfile };
