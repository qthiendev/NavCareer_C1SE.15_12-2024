const { query } = require('../database/connectTestDB');

const getProfileByAuthID = async (AUTHENTICATION_ID) => {
    try {
        const queryString = `
        SELECT [USER_ID],
            [AUTHENTICATION_ID],
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

const getProfileByUserName = async (USER_NAME) => {
    try {
        const queryString = `
        SELECT [USER_ID],
            [AUTHENTICATION_ID],
            [USER_NAME],
            [DISPLAY_FIRST_NAME],
            [DISPLAY_LAST_NAME],
            [GENDER],
            [BIRTH_DATE],
            [PHONE_NUMBER],
            [ADDRESS]
        FROM [TestDB].[dbo].[USERS]
        WHERE [USER_NAME] = @USER_NAME
        `;

        const params = {
            USER_NAME: USER_NAME
        };

        const result = await query("sa", queryString, params);

        return result;

    } catch (err) {
        throw err;
    }
}

const getProfileByUserID = async (USER_ID) => {
    try {
        const queryString = `
        SELECT [USER_ID],
            [AUTHENTICATION_ID],
            [USER_NAME],
            [DISPLAY_FIRST_NAME],
            [DISPLAY_LAST_NAME],
            [GENDER],
            [BIRTH_DATE],
            [PHONE_NUMBER],
            [ADDRESS]
        FROM [TestDB].[dbo].[USERS]
        WHERE [USER_ID] = @USER_ID
        `;

        const params = {
            USER_ID: USER_ID
        };

        const result = await query("sa", queryString, params);

        return result;

    } catch (err) {
        throw err;
    }
}



module.exports = { getProfileByAuthID, getProfileByUserName, getProfileByUserID };