const ncdb = require('../../../apis/databases/ncdbService');

const tryDiableAuth = async (role, aid, password) => {
    try {
        if (!role || !Number.parseInt(aid) || !password)
            throw new Error(`Index and password must be provided.`);

        const result = await ncdb.query(role,
            'EXECUTE SetAuthState  @aid, @password, @is_active',
            { aid: aid, password: password, is_active: 0 });

        return result && result.length > 0;

    } catch (err) {
        throw new Error(`disableAuthService.js/tryDiableAuth | ${err.message}`);
    }
}

module.exports = { tryDiableAuth };