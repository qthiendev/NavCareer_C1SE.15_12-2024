const { queryDB } = require('../../database/queryDBService');

const tryUpdateProfile = async (profileData) => {
    try {
        const { userType, userId, userName, email, birthdate, gender, phoneNumber, address } = profileData;

        const queryString = `
            UPDATE [Users]
            SET [user_name] = @userName,  
                [email] = @email,  
                [birthdate] = @birthdate,  
                [gender] = @gender,  
                [phone_number] = @phoneNumber,  
                [address] = @address, 
            WHERE [user_id] = @userId;
        `;

        const params = { userId, userName, email, birthdate, gender, phoneNumber, address };

        // Update profile data and return the updated record
        const result = await queryDB(userType, queryString, params);

        return result.length > 0 ? result[0] : null;

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at updateProfileService.js/tryUpdateProfile() | {\n${err.message}\n}`);
        return null;
    }
};

module.exports = { tryUpdateProfile };
