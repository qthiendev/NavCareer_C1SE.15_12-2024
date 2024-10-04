const ncdb = require('../../../apis/databases/ncdbService');

const trySignIn = async (userType, account, password) => {
    try {
        if (!account || !password) 
            throw new Error(`Account and password must be provided.`);

        const queryString = `EXECUTE SignIn @secret_key, @account, @password`;
        const params = { account, password };

        const result = await ncdb.query(userType, queryString, params);

        const authentication_id = (result[0]).authentication_id
        const authorization_id = (result[0]).authorization_id

        const authorization = await ncdb.query(userType, `EXECUTE ReadAuthorization @secret_key, @authorization_id`, { authorization_id });

        return {aid: authentication_id, role: (authorization[0]).description};

    } catch (err) {
        throw new Error(`signInService.js/trySignIn | ${err.message}`);
    }
};

module.exports = { trySignIn };
