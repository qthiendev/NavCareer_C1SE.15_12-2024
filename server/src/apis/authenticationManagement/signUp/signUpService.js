const ncdb = require('../../databases/ncdbService');
const now = new Date();

const trySignUp = async (role, account, password, identifierEmail, authorizationId) => {
    try {
        const signUp = await ncdb.query(role,
            `EXECUTE SignUp @account, @password, @identifier_email, @authorization_id`,
            { account: account, password: password, identifier_email: identifierEmail, authorization_id: authorizationId });

        return signUp[0].check;

    } catch (err) {
        throw new Error(`signUpService.js/trySignUp | ${err.message}`);
    }
};

module.exports = { trySignUp };