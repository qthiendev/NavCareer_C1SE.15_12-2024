const ncdb = require('../../databases/ncdbService');

const tryReadProfile = async (role, user_id, auth_id) => {
    try {
        if (typeof Number.parseInt(user_id) === 'number' && user_id != undefined) {
            const result = await ncdb.query(role, `EXECUTE ReadProfile @user_id`, { user_id });
            return result.length > 0 ? result[0] : null;
        }

        const result = await ncdb.query(role, `EXECUTE ReadProfileByAuth @auth_id`, { auth_id });
        return result.length > 0 ? result[0] : null;

    } catch (err) {
        throw new Error(err.message);
    }
};


const tryReadProfileSignedIn = async (role, aid, user_id, auth_id) => {
    try {
        if (typeof Number.parseInt(user_id) === 'number' && user_id != undefined) {
            const result = await ncdb.query(role, `EXECUTE ReadProfileSignedIn @aid, @user_id`, { aid, user_id });
            return result.length > 0 ? result[0] : null;
        }

        const result = await ncdb.query(role, `EXECUTE ReadProfileSignedInByAuth @aid, @auth_id`, { aid, auth_id });
        return result.length > 0 ? result[0] : null;

    } catch (err) {
        throw new Error(`readProfileService.js/tryReadProfile | ${err.message}`);
    }
};

module.exports = { tryReadProfile, tryReadProfileSignedIn };