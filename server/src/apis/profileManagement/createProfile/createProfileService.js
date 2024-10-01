const { queryDB } = require('../../database/queryDBService');

const tryCreateProfile = async (profileData) => {
    try {
        const { userType, userId, userName, email, birthdate, gender, phoneNumber, address, authenticationId } = profileData;

        const queryString = `
            INSERT INTO [Users] (
                [user_id], 
                [user_name], 
                [email], 
                [birthdate], 
                [gender], 
                [phone_number], 
                [address], 
                [date_joined], 
                [authentication_id]
            ) 
            VALUES (
                @userId, 
                @userName, 
                @Email, 
                @birthdate, 
                @gender, 
                @phoneNumber, 
                @address, 
                GETDATE(), 
                @authenticationId
            );
        `;

        const params = { userId, userName, email, birthdate, gender, phoneNumber, address, authenticationId };

        // Insert profile data and return the inserted record's id
        const result = await queryDB(userType, queryString, params);

        return result && result.length > 0 ? { profileId: result[0].id, ...profileData } : null;

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at createProfileService.js/tryCreateProfile() | {\n${err.message}\n}`);
        return null;
    }
};

module.exports = { tryCreateProfile };
