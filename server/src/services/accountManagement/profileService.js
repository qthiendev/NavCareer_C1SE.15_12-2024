const { query } = require('../database/connectTestDB');

const getProfileService = async (AUTHENTICATION_ID) => {
    try {
        const queryString = `
        SELECT [USER_ID],
            [USER_NAME],
            [DISPLAY_FIRST_NAME],
            [DISPLAY_LAST_NAME],
            [GENDER],
            [BIRTH_DATE],
            [PHONE_NUMBER],
            [ADDRESS]
        FROM [TestDB].[dbo].[USERS]
        WHERE [AUTHENTICATION_ID] = @AUTHENTICATION_ID
        `;

        const params = {
            AUTHENTICATION_ID: AUTHENTICATION_ID
        };

        const result = await query("sa", queryString, params);

        return result;

    } catch (err) {
        throw err;
    }
}

module.exports = { getProfileService };