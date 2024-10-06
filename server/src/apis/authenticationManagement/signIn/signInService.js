const ncdb = require('../../../apis/databases/ncdbService');

const trySignIn = async (role, body_account, body_password) => {
    try {
        if (!body_account || !body_password)
            throw new Error(`Account and password must be provided.`);

        const queryString = `EXECUTE SignIn @account, @password`;
        const params = { account: body_account, password: body_password };

        const result = await ncdb.query(role, queryString, params);

        if (result && result.length > 0) {
            const authentication_id = (result[0]).authentication_id;
            const db_role = (result[0]).role;
            return {
                q_aid: authentication_id,
                q_role: db_role,
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
