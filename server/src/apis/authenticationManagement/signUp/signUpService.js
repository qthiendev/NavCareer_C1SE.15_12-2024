const ncdb = require('../../databases/ncdbService');
const now = new Date();

const trySignUp = async (account, password, identifier_email, authorization_id) => {
    try {
        // Insert new authentication data
        const insertQuery = `EXECUTE CreateAuthentication @account, @password, @identifier_email, @authorization_id`;

        const params = {
            account: account,
            password: password,
            identifier_email: identifier_email,
            authorization_id: authorization_id
        };

        await ncdb.query('sa', insertQuery, params);

        // Verify
        const checkQuery = `EXECUTE ReadAuthentication @account, @password`;

        const checkParams = {
            account: account,
            password: password
        };

        const checkResult = await ncdb.query('sa', checkQuery, checkParams);

        return checkResult && checkResult[0].authorization_id === Number.parseInt(authorization_id);

    } catch (err) {
        throw new Error(`signUpService.js/trySignUp() | ${err.message}`);
    }
};

module.exports = { trySignUp };