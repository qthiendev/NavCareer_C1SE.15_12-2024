const ncdb = require('../../../databases/ncdbService');

const tryCreateCollection = async (aid, role, collection_name, collection_type_id, module_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (!collection_name || !collection_name.trim()) throw new Error(`'collection_name' cannot be empty.`);
        if (Number.isNaN(collection_type_id)) throw new Error(`'collection_type_id' is required.`);
        if (Number.isNaN(module_id)) throw new Error(`'module_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE CreateCollection @aid, @collection_name, @collection_type_id, @module_id`,
            {
                aid: Number(aid),
                collection_name: collection_name.trim(),
                collection_type_id: Number(collection_type_id),
                module_id: Number(module_id),
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`createCollectionService.js/tryCreateCollection | ${err.message}`);
    }
};

module.exports = { tryCreateCollection };