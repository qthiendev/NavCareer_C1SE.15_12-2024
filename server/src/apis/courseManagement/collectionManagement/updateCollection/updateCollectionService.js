const ncdb = require('../../../databases/ncdbService');

const tryUpdateCollection = async (aid, role, module_id, collection_id, collection_name, collection_type_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(module_id)) throw new Error(`'module_id' is required.`);
        if (Number.isNaN(collection_id)) throw new Error(`'collection_id' is required.`);
        if (!collection_name || !collection_name.trim()) throw new Error(`'collection_name' cannot be empty.`);
        if (Number.isNaN(collection_type_id)) throw new Error(`'collection_type_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE UpdateCollection @aid, @module_id, @collection_id, @collection_name, @collection_type_id`,
            {
                aid: Number(aid),
                module_id: Number(module_id),
                collection_id: Number(collection_id),
                collection_name: collection_name.trim(),
                collection_type_id: Number(collection_type_id),
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`updateCollectionService.js/tryUpdateCollection | ${err.message}`);
    }
};

const tryChangeCollectionOrdinal = async (aid, role, module_id, collection_id_1, collection_id_2) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(module_id)) throw new Error(`'module_id' is required.`);
        if (Number.isNaN(collection_id_1)) throw new Error(`'collection_id_1' is required.`);
        if (Number.isNaN(collection_id_2)) throw new Error(`'collection_id_2' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE ChangeCollectionOrdinal @aid, @module_id, @collection_id_1, @collection_id_2`,
            {
                aid: Number(aid),
                module_id: Number(module_id),
                collection_id_1: Number(collection_id_1),
                collection_id_2: Number(collection_id_2),
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`updateCollectionService.js/tryChangeCollectionOrdinal | ${err.message}`);
    }
};

module.exports = { tryUpdateCollection, tryChangeCollectionOrdinal };