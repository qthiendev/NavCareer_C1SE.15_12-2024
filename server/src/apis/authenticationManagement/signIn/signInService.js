const ncdb = require('../../../apis/databases/ncdbService');

const trySignIn = async (userType, account, password) => {
    try {
        if (!account || !password) 
            throw new Error(`Account and password must be provided.`);

        const queryString = `EXECUTE ReadAuthentication @account, @password`;
        const params = { account, password };

        const result = await ncdb.query(userType, queryString, params);

        return result[0];

    } catch (err) {
        throw new Error(`signInService.js/trySignIn() | Error: >{${err.message}}<`);
    }
};

module.exports = { trySignIn };
