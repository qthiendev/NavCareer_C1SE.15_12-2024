const ncbd = require('../../databases/ncdbService');

// Utility function to convert date from dd/MM/yyyy to yyyy-MM-dd
const tryDeleteProfile = async (role, userID) => {
    try {
        const queryString = `EXECUTE DeleteProfile @user_id`;

        const params = { user_id: userID};

        const result = await ncdb.query(role, queryString, params);

        return result.length > 0 ? result[0] : null;

    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { tryDeleteProfile };
