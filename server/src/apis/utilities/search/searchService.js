const ncdb = require('../../databases/ncdbService');

const trySearch = async (role, index) => {
    try {
        const result = await ncdb.query(role, `EXECUTE Search @index`, { index });

        return result.length > 0 ? result : [];

    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { trySearch };