const { queryDB } = require('../../database/queryDBService');

const tryReadProfile = async (userType, index) => {
    try {
        const queryString = `
            SELECT [user_id],
                   [user_name],
                   [email], 
                   [birthdate], 
                   [gender], 
                   [phone_number], 
                   [address],
                   [date_joined],
                   [authentication_id]
            FROM [Users]
            WHERE [authentication_id] = @index
               OR [user_name] = @index
               OR [user_id] = @index
        `;

        const params = { index };

        const result = await queryDB(userType, queryString, params);

        return result.length > 0 ? result[0] : null;

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at readProfileService.js/tryReadProfile() | {\n${err.message}\n}`);
        return null;
    }
};

module.exports = { tryReadProfile };