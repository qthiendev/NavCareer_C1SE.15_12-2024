const ncdb = require('../../databases/ncdbService');

const tryReadProfile = async (role, authID) => {
    try {
        const queryString = `EXECUTE ViewProfile @auth_id`;

        const params = { auth_id: authID};

        const result = await ncdb.query(role, queryString, params);

        return result.length > 0 ? result[0] : null;

    } catch (err) {
        throw new Error(err.message);
    }
};


const tryReadProfileSignedIn = async (role, aid, authID) => {
    try {
        const queryString = `EXECUTE ViewProfileSignedIn @aid, @auth_id`;

        const params = { aid, auth_id: authID};

        const result = await ncdb.query(role, queryString, params);

        return result.length > 0 ? result[0] : null;

    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { tryReadProfile, tryReadProfileSignedIn };