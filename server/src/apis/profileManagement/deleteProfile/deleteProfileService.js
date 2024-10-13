const ncbd = require('../../databases/ncdbService');

const tryDeleteProfile = async (role, userID) => {
    try {
        if (Number.isNaN(userID))
            throw new Error(`'userID' must provided.`);

        const queryString = `EXECUTE DeleteProfile @user_id`;

        const params = { user_id: userID};

        await ncbd.query(role, queryString, params);


    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { tryDeleteProfile };
