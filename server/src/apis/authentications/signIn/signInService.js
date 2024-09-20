const { queryDB } = require('../../database/queryDBService');

const trySignIn = async (userType, account, password) => {
    try {
        const queryString = `
            select [authentication_id]
            from [authentications]
            where [account] = @account
                and [password] = @password
        `;

        const params = {
            account: account,
            password: password
        };

        const result = await queryDB(userType, queryString, params);

        return result[0];

    } catch(err) {
        const now = new Date();
        console.log(`[${now.toLocaleString()}] at signInService.js/trySignIn() | {\n${err.message}\n}`);
    }
}

module.exports = { trySignIn };