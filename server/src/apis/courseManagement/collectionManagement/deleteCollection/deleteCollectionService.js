const ncdb = require('../../../databases/ncdbService');

const tryDeleteCollection = async (aid, role, module_id, collection_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(module_id)) throw new Error(`'module_id' is required.`);
        if (Number.isNaN(collection_id)) throw new Error(`'collection_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE DeleteCollection @aid, @module_id, @collection_id`,
            {
                aid: Number(aid),
                module_id: Number(module_id),
                collection_id: Number(collection_id),
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`deleteCollectionService.js/tryDeleteCollection | ${err.message}`);
    }
};

module.exports = { tryDeleteCollection };