const ncdb = require('../../databases/ncdbService');
const now = new Date();

const trySignUp = async (account, password, identifierEmail, authorizationId) => {
    try {
        const checkExist = await ncdb.query('GST', `EXECUTE SignIn @secret_key, @account, @password`, { account, password });

        if (checkExist && checkExist.length > 0)
            return 'EXISTED';

        const insertQuery = `EXECUTE CreateAuthentication @secret_key, @account, @password, @identifier_email, @authorization_id`;

        const params = {
            account: account,
            password: password,
            identifier_email: identifierEmail,
            authorization_id: authorizationId
        };

        await ncdb.query('GST', insertQuery, params);

        // Verify
        const checkResult = await ncdb.query('GST', `EXECUTE SignIn @secret_key, @account, @password`, { account, password });

        return checkResult && checkResult[0].authorization_id === Number.parseInt(authorizationId) ? 'SUCCESSED' : 'FAILED';

    } catch (err) {
        throw new Error(`signUpService.js/trySignUp | ${err.message}`);
    }
};

module.exports = { trySignUp };