// const { query } = require('../database/connectTestDB');

// const signInService = async (account, password) => {
//     try {
//         const queryString = `
//         SELECT [AUTHENTICATION_ID]
//         FROM [DBO].[AUTHENTICATIONS]
//         WHERE [ACCOUNT] = @account 
//             AND [PASSWORD] = @password;
//         `;

//         const params = {
//             account: account,
//             password: password
//         };

//         const result = await query("sa", queryString, params);

//         return result;

//     } catch (err) {
//         throw err;
//     }
// }

// module.exports = { signInService };