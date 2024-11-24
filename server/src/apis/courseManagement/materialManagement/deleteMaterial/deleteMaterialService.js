// deleteMaterialService.js
const ncdb = require('../../../databases/ncdbService');

const tryDeleteMaterial = async (aid, role, collection_id, material_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(collection_id)) throw new Error(`'collection_id' is required.`);
        if (Number.isNaN(material_id)) throw new Error(`'material_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE DeleteMaterial @aid, @collection_id, @material_id`,
            {
                aid: Number(aid),
                collection_id: Number(collection_id),
                material_id: Number(material_id),
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`deleteMaterialService.js/tryDeleteMaterial | ${err.message}`);
    }
};

module.exports = { tryDeleteMaterial };