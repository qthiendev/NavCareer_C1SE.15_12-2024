const ncbd = require('../../databases/ncdbService');

// Utility function to convert date from dd/MM/yyyy to yyyy-MM-dd
const formatDate = (birthdate) => {
    const [day, month, year] = birthdate.split('/');
    return `${year}-${month}-${day}`; // yyyy-MM-dd
};

const tryCreateProfile = async (profileData) => {
    const {
        aid,
        role,
        userFullName,
        birthdate,
        gender,
        email,
        phoneNumber,
        address,
    } = profileData;

    try {
        // Convert birthdate from dd/MM/yyyy to yyyy-MM-dd format
        const formattedBirthdate = formatDate(birthdate);

        // Create profile query and parameters
        const queryString = `EXECUTE CreateProfile @aid, @user_full_name, 
            @birthdate, @gender, @email, @phone_number, 
            @address`;
        const params = {
            aid: aid,
            user_full_name: userFullName,
            birthdate: formattedBirthdate,
            gender: gender,
            email: email,
            phone_number: phoneNumber,
            address: address,
        };

        // Insert profile data
        const results = await ncbd.query(role, queryString, params);


        return results && results.length > 0;

    } catch (err) {
        throw Error(`createProfileService.js/tryCreateProfile() | ${err.message}`);
    }
};

module.exports = { tryCreateProfile };
