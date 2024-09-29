const { queryDB } = require('../../database/queryDBService');
const now = new Date();

const trySignUp = async (userType, account, password, email, authorization_id) => {
    try {
        const latestIDResult = await queryDB(
            userType,
            `SELECT TOP 1 authentication_id FROM Authentications ORDER BY authentication_id DESC`,
            {}
        ) || [];

        const latestID = (latestIDResult.length > 0) ? latestIDResult[0].authentication_id : 0;
        const newID = parseInt(latestID) + 1;

        // Insert new authentication data
        const insertQuery = `
            INSERT INTO Authentications (authentication_id, account, password, identifier_email, created_date, authorization_id)
            VALUES (@newID, @account, @password, @identifier_email, @created_date, @authorization_id)
        `;

        const params = {
            newID: newID,
            account: account,
            password: password,
            identifier_email: email,
            created_date: now.toISOString(),
            authorization_id: authorization_id
        };

        await queryDB(userType, insertQuery, params);

        // Verify
        const checkQuery = `
            SELECT * FROM Authentications 
            WHERE authentication_id = @newID AND account = @account AND identifier_email = @identifier_email
        `;
        
        const checkParams = {
            newID: newID,
            account: account,
            identifier_email: email
        };

        const checkResult = await queryDB(userType, checkQuery, checkParams);

        return checkResult.length > 0;

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at signUpService.js/trySignUp() | {\n${err.message}\n}`);
        return false;
    }
};

module.exports = { trySignUp };