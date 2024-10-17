const ncdb = require('../../databases/ncdbService');

const tryReadProfile = async (role, userID) => {
    try {
        const queryString = `EXECUTE ViewProfile @auth_id`;

        const params = { auth_id: userID};

        const result = await ncdb.query(role, queryString, params);

        return result.length > 0 ? result[0] : null;

    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { tryReadProfile };