const ncdb = require('../../databases/ncdbService');
const now = new Date();

const trySignUp = async (role, account, password, identifierEmail, authorizationId) => {
    try {
        // Verify step 1
        const checkExist = await ncdb.query(role, `EXECUTE SignIn @account, @password`, { account, password });

        if (checkExist && checkExist.length > 0)
            return 'EXISTED';

        // insert new auth
        await ncdb.query(role,
            `EXECUTE SignUp @account, @password, @identifier_email, @authorization_id`,
            { account: account, password: password, identifier_email: identifierEmail, authorization_id: authorizationId });

        // Verify step 2
        const checkResult = await ncdb.query(role, `EXECUTE SignIn @account, @password`, { account, password });

        return checkResult && checkResult.length > 0 ? 'SUCCESSED' : 'FAILED';

    } catch (err) {
        throw new Error(`signUpService.js/trySignUp | ${err.message}`);
    }
};

module.exports = { trySignUp };