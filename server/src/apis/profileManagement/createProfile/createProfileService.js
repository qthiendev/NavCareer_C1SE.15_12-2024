const ncbd = require('../../databases/ncdbService');

// Utility function to convert date from dd/MM/yyyy to yyyy-MM-dd
const formatDate = (birthdate) => {
    const [day, month, year] = birthdate.split('/');
    return `${year}-${month}-${day}`; // yyyy-MM-dd
};

const tryCreateProfile = async (profileData) => {
    const {
        userType,
        userFullName,
        email,
        birthdate,
        gender,
        phoneNumber,
        address,
        authenticationId
    } = profileData;

    try {
        // Check if the profile already exists
        const existingProfile = await ncbd.query(
            userType, 
            `EXECUTE ReadProfile @authentication_id`, 
            { authentication_id: authenticationId }
        );

        if (existingProfile && existingProfile.length > 0) {
            return 3; // Profile already exists
        }

        // Convert birthdate from dd/MM/yyyy to yyyy-MM-dd format
        const formattedBirthdate = formatDate(birthdate);

        // Create profile query and parameters
        const queryString = `EXECUTE CreateProfile @user_name, @email, @birthdate, @gender, @phone_number, @address, @authentication_id`;
        const params = {
            user_name: userFullName,
            email: email,
            birthdate: formattedBirthdate,
            gender: gender,
            phone_number: phoneNumber,
            address: address,
            authentication_id: authenticationId
        };

        // Insert profile data
        await ncbd.query(userType, queryString, params);

        // Verify the profile insertion
        const newProfile = await ncbd.query(
            userType, 
            `EXECUTE ReadProfile @authentication_id`, 
            { authentication_id: authenticationId }
        );

        return newProfile && newProfile.length > 0 ? 2 : 1;

    } catch (err) {
        throw Error(`createProfileService.js/tryCreateProfile() | ${err.message}`);
    }
};

module.exports = { tryCreateProfile };
