const ncdb = require('../../../databases/ncdbService');

const tryReadAll = async (role) => {
    try {
        if (!role)
            throw new Error(`'role' is empty`);

        const results = ncdb.query(role, 'EXECUTE ReadAllUser', {});

        return results;

    } catch (err) {
        throw new Error(`readAllService.js/tryReadAll| ${err.message}`);
    }
};

module.exports = { tryReadAll };