const ncbd = require('../../databases/ncdbService');

// Utility function to convert date from dd/MM/yyyy to yyyy-MM-dd
const formatDate = (birthdate) => {
    const [day, month, year] = birthdate.split('/');
    return `${year}-${month}-${day}`; // yyyy-MM-dd
};

const tryCreateProfile = async (aid, role, user_full_name, user_birthdate, user_gender, user_email, user_phone_number, user_address) => {
    try {
        // Convert birthdate from dd/MM/yyyy to yyyy-MM-dd format
        const formattedBirthdate = formatDate(user_birthdate);
        
        // Insert profile data
        const results = await ncbd.query(role,
            `EXECUTE CreateProfile @aid, @user_full_name, @user_birthdate, @user_gender, @user_email, @user_phone_number, @user_address`, 
            {aid, user_full_name, user_birthdate: formattedBirthdate, user_gender, user_email, user_phone_number, user_address});


        return results[0].check;

    } catch (err) {
        throw Error(`createProfileService.js/tryCreateProfile | ${err.message}`);
    }
};

module.exports = { tryCreateProfile };
