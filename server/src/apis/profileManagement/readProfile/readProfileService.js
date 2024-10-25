const ncdb = require('../../databases/ncdbService');

const tryReadProfile = async (aid, role, user_id) => {
    try {
        if (!role)
            throw new Error(`'role' must define`);

        if (Number.isNaN(user_id))
            throw new Error(`'user_id' must define`);

        let result = null;

        if (!Number.isNaN(aid) && aid !== null && aid !== undefined) {
            result = await ncdb.query(role, `EXECUTE ReadProfileSignedIn @aid, @user_id`, { aid, user_id });
        } else {
            result = await ncdb.query(role, `EXECUTE ReadProfile @user_id`, { user_id });
        }

        return result[0];


    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { tryReadProfile };