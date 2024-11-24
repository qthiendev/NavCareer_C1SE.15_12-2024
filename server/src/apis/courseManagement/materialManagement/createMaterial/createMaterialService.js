// createMaterialService.js
const ncdb = require('../../../databases/ncdbService');

const tryCreateMaterial = async (aid, role, material_content, material_type_id, collection_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (!material_content || !material_content.trim()) throw new Error(`'material_content' cannot be empty.`);
        if (Number.isNaN(material_type_id)) throw new Error(`'material_type_id' is required.`);
        if (Number.isNaN(collection_id)) throw new Error(`'collection_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE CreateMaterial @aid, @material_content, @material_type_id, @collection_id`,
            {
                aid: Number(aid),
                material_content: material_content.trim(),
                material_type_id: Number(material_type_id),
                collection_id: Number(collection_id),
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`createMaterialService.js/tryCreateMaterial | ${err.message}`);
    }
};

module.exports = { tryCreateMaterial };