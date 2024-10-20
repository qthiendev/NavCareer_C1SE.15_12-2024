const ncdb = require('../../../apis/databases/ncdbService');

const trySignIn = async (role, account, password) => {
    try {
        if (!account || !password)
            throw new Error(`Account and password must be provided.`);

        const result = await ncdb.query(role, 
            `EXECUTE SignIn @account, @password`,
            { account, password });

        if (result && result.length > 0) {
            return {
                q_aid: (result[0]).authentication_id,
                q_role: (result[0]).role,
            };
        }

        return {
            q_aid: null,
            q_role: 'NAV_GUEST',
        };

    } catch (err) {
        throw new Error(`signInService.js/trySignIn | ${err.message}`);
    }
};

module.exports = { trySignIn };
