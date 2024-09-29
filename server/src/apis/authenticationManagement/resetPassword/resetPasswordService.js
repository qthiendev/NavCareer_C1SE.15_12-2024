const { queryDB } = require('../../database/queryDBService');

const tryResetPassword = async (userType, account_id, newPassword) => {
    try {
        const queryString = `
        update [authentications]
        set 
        `;

        const params = {
            account_id: account_id,
            newPassword: newPassword
        };

        const result = await queryDB(userType, queryString, params);

        return result[0];

    } catch(err) {
        const now = new Date();
        console.log(`[${now.toLocaleString()}] at resetPasswordService.js/tryResetPassword() | {\n${err.message}\n}`);
    }
}

module.exports = { tryResetPassword };