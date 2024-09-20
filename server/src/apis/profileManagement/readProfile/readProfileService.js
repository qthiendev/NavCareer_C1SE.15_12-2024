const { queryDB } = require('../../database/queryDBService');

const tryReadProfile = async (userType, index) => {
    try {
        const queryString = `
            select [user_id],
                [user_name],
                [email], [birthdate], 
                [gender], 
                [phone_number], 
                [address],
                [date_joined],
                [authentication_id]
            from [users]
            where [authentication_id] = @index
                or [user_name] = @index
                or [user_id] = @index
        `;

        const params = {
            index: index
        };

        const result = await queryDB(userType, queryString, params);

        return result[0];

    } catch (err) {
        const now = new Date();
        console.log(`[${now.toLocaleString()}] at readProfileService.js/tryReadProfile() | {\n${err.message}\n}`);
    }
}

module.exports = { tryReadProfile };