// updateMaterialService.js
const ncdb = require('../../../databases/ncdbService');

const tryUpdateMaterial = async (aid, role, collection_id, material_id, material_content, material_type_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(collection_id)) throw new Error(`'collection_id' is required.`);
        if (Number.isNaN(material_id)) throw new Error(`'material_id' is required.`);
        if (!material_content || !material_content.trim()) throw new Error(`'material_content' cannot be empty.`);
        if (Number.isNaN(material_type_id)) throw new Error(`'material_type_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE UpdateMaterial @aid, @collection_id, @material_id, @material_content, @material_type_id`,
            {
                aid: Number(aid),
                collection_id: Number(collection_id),
                material_id: Number(material_id),
                material_content: material_content.trim(),
                material_type_id: Number(material_type_id),
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`updateMaterialService.js/tryUpdateMaterial | ${err.message}`);
    }
};

const tryChangeMaterialOrdinal = async (aid, role, collection_id, material_id_1, material_id_2) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(collection_id)) throw new Error(`'collection_id' is required.`);
        if (Number.isNaN(material_id_1)) throw new Error(`'material_id_1' is required.`);
        if (Number.isNaN(material_id_2)) throw new Error(`'material_id_2' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE ChangeMaterialOrdinal @aid, @collection_id, @material_id_1, @material_id_2`,
            {
                aid: Number(aid),
                collection_id: Number(collection_id),
                material_id_1: Number(material_id_1),
                material_id_2: Number(material_id_2),
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`updateMaterialService.js/tryChangeMaterialOrdinal | ${err.message}`);
    }
};

module.exports = { tryUpdateMaterial, tryChangeMaterialOrdinal };