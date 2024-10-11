const ncdb = require('../../databases/ncdbService');

const formatDate = (birthdate) => {
    const [day, month, year] = birthdate.split('/');
    return `${year}-${month}-${day}`; // yyyy-MM-dd
};

const tryUpdateProfile = async (profileData) => {
    
        const { userType,
            userId,
            userFullName,
            birthdate,
            gender,
            email,
            phoneNumber,
            address,
            authenticationId,
            isActive
        } = profileData;
        try {
            // Check if the profile already exists
            const existingProfile = await ncdb.query(
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
            const queryString = `
            EXEC UpdateProfile @user_id, @user_full_name, 
            @birthdate, @gender, @email, @phone_number, 
            @address, @authentication_id,@is_active;
        `;
        const params = { 
            userType, 
            userId: userId,
            user_full_name: userFullName,
            birthdate: formattedBirthdate,
            gender: gender,
            email: email,
            phone_number: phoneNumber,
            address: address,
            authentication_id: authenticationId,
            is_active: isActive
         };
            
            // Insert profile data
            await ncbd.query(userType, queryString, params);
    
            // Verify the profile insertion
            const newProfile = await ncbd.query(
                userType, 
                `EXECUTE ViewProfile @authentication_id`, 
                { authentication_id: authenticationId }
            );
    
            return newProfile && newProfile.length > 0 ? 2 : 1;
    
        } catch (err) {
            throw Error(`createProfileService.js/tryCreateProfile() | ${err.message}`);
        }
};

module.exports = { tryUpdateProfile };
