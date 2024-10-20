const { tryCreateProfile } = require('./createProfileService');
const now = new Date();

const createProfile = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const {
            user_full_name,
            user_birthdate,
            user_gender,
            user_email,
            user_phone_number,
            user_address
        } = req.body;

        // Validate required fields
        if (!user_full_name
            || !user_birthdate
            || Number.isNaN(user_gender)
            || !user_email
            || !user_phone_number
            || !user_address) {
            throw new Error('missing elements', user_full_name, user_birthdate, user_gender, user_email, user_phone_number, user_address);
        }

        const result = await tryCreateProfile(aid, role, user_full_name, user_birthdate, user_gender, user_email, user_phone_number, user_address);

        if (result === 'U_AID') {
            console.error(`[${now.toLocaleString()}] at createProfileController.js/createProfile | Authentication ${aid} not exist.`);
            return res.status(403).json({
                message: `Authentication ${aid} not exist.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'EXISTED') {
            console.warn(`[${now.toLocaleString()}] at createProfileController.js/createProfile | Profile already existed.`);
            return res.status(201).json({
                message: `Profile already existed.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at createProfileController.js/createProfile | Profile created succesfuly.`);
            return res.status(200).json({
                message: `Profile created succesfuly.`,
                time: now.toLocaleString()
            });
        }


        console.log(`[${now.toLocaleString()}] at createProfileController.js/createProfile | Profile failed to create.`);
        return res.status(203).json({
            message: `Profile failed to create.`,
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at createProfileController.js/createProfile | ${err.message}`);
        res.status(500).json({
            message: 'Failed to create profile. Please try again.',
            create_status: false
        });
    }
};

module.exports = { createProfile };
