const ncdb = require('../../../apis/databases/ncdbService');

const trySignIn = async (role, account, password) => {
    try {
        if (!role)
            throw new Error(`'role' must be provided.`);

        if (!account)
            throw new Error(`'account' must be provided.`);

        if (!password)
            throw new Error(`'password' must be provided.`);

        const result = await ncdb.query(role, 
            `EXECUTE SignIn @account, @password`,
            { account, password });

        return result[0];

    } catch (err) {
        throw new Error(`signInService.js/trySignIn | ${err.message}`);
    }
};

module.exports = { trySignIn };
