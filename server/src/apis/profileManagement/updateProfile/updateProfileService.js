const ncbd = require('../../databases/ncdbService');

const formatDate = (birthdate) => {
    const [day, month, year] = birthdate.split('/');
    return `${year}-${month}-${day}`; // yyyy-MM-dd
};

const tryUpdateProfile = async (aid, role, user_full_name, user_alias, user_bio, user_birthdate, user_gender, user_email, user_phone_number, user_address, user_status) => {
    try {
        if (!user_full_name
            || !user_alias
            || !user_birthdate
            || Number.isNaN(user_gender)
            || !user_email
            || !user_phone_number
            || !user_address
            || Number.isNaN(user_status)) {
            throw new Error('missing elements', user_full_name, user_alias, user_birthdate, user_gender, user_email, user_phone_number, user_address, user_status);
        }

        const formattedBirthdate = formatDate(user_birthdate);

        const updateProfile = await ncbd.query(role,
            `EXEC UpdateProfile @aid, @user_full_name, @user_alias, @user_bio, @user_birthdate, @user_gender, @user_email, @user_phone_number, @user_address, @user_status`,
            { aid, user_full_name, user_alias, user_bio, user_birthdate: formattedBirthdate, user_gender, user_email, user_phone_number, user_address, user_status });

        return updateProfile[0].check;

    } catch (err) {
        throw Error(`updateProfileService.js/tryUpdateProfile | ${err.message}`);
    }
};

module.exports = { tryUpdateProfile };
