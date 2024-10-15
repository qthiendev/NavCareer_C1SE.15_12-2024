const ncbd = require('../../databases/ncdbService');

const formatDate = (birthdate) => {
    const [day, month, year] = birthdate.split('/');
    return `${year}-${month}-${day}`; // yyyy-MM-dd
};

const tryUpdateProfile = async (profileData) => {

    const {
        aid,
        role,
        user_id,
        user_full_name,
        email,
        birthdate,
        gender,
        phone_number,
        address
    } = profileData;

    console.log(profileData)
    try {

        // Convert birthdate from dd/MM/yyyy to yyyy-MM-dd format
        const formattedBirthdate = formatDate(birthdate);

        // Create profile query and parameters
        const queryString = `
            EXEC UpdateProfile @aid, @user_id, @user_full_name, 
            @birthdate, @gender, @email, @phone_number, 
            @address;`;
        const params = {
            aid,
            user_id,
            user_full_name,
            birthdate: formattedBirthdate,
            email,
            gender,
            phone_number,
            address
        };

        // Insert profile data
        const newProfile = await ncbd.query(role, queryString, params);

        return newProfile && newProfile.length > 0;

    } catch (err) {
        throw Error(`createProfileService.js/tryUpdateProfile() | ${err.message}`);
    }
};

module.exports = { tryUpdateProfile };
