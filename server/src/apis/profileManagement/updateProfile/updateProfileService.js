const ncdb = require('../../databases/ncdbService');

const formatDate = (birthdate) => {
    const [day, month, year] = birthdate.split('/');
    return `${year}-${month}-${day}`; // yyyy-MM-dd
};

const tryUpdateProfile = async (profileData) => {
    
        const { aid,
            role,
            userid,
            userFullName,
            birthdate,
            gender,
            email,
            phoneNumber,
            address
        } = profileData;
        try {
    
            if (existingProfile && existingProfile.length > 0) {
                return 3; // Profile already exists
            }
    
            // Convert birthdate from dd/MM/yyyy to yyyy-MM-dd format
            const formattedBirthdate = formatDate(birthdate);
    
            // Create profile query and parameters
            const queryString = `
            EXEC UpdateProfile @aid, @user_id, @user_full_name, 
            @birthdate, @gender, @email, @phone_number, 
            @address;`;
        const params = { 
            aid: aid,
            user_id: userid,
            user_full_name: userFullName,
            birthdate: formattedBirthdate,
            gender: gender,
            email: email,
            phone_number: phoneNumber,
            address: address
         };
            
            // Insert profile data
            await ncbd.query(role, queryString, params);
    
            return newProfile && newProfile.length > 0 ;
    
        } catch (err) {
            throw Error(`createProfileService.js/tryUpdateProfile() | ${err.message}`);
        }
};

module.exports = { tryUpdateProfile };
