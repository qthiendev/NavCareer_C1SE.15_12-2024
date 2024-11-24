const { tryUpdateMaterial, tryChangeMaterialOrdinal } = require('./updateMaterialService');
const now = () => new Date().toLocaleString(); // Utility function for consistent timestamps

const updateMaterial = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { collection_id, material_id, material_content, material_type_id } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] | 'aid' is required.`);
            return res.status(400).json({ message: `'aid' is required.`, time: now() });
        }

        if (!role) {
            console.error(`[${now()}] | 'role' is required.`);
            return res.status(400).json({ message: `'role' is required.`, time: now() });
        }

        const result = await tryUpdateMaterial(aid, role, collection_id, material_id, material_content, material_type_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] | User ${aid} is banned from updating materials.`);
            return res.status(403).json({ message: `User ${aid} is banned from updating materials.`, time: now() });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] | User ID ${aid} not found.`);
            return res.status(404).json({ message: `User ID ${aid} not found.`, time: now() });
        }

        if (result === 'U_CID') {
            console.error(`[${now()}] | Collection ${collection_id} does not exist.`);
            return res.status(404).json({ message: `Collection ${collection_id} does not exist.`, time: now() });
        }

        if (result === 'U_MID') {
            console.error(`[${now()}] | Material ${material_id} does not exist.`);
            return res.status(404).json({ message: `Material ${material_id} does not exist.`, time: now() });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] | Material updated successfully in Collection ${collection_id}.`);
            return res.status(200).json({ message: `Material updated successfully in Collection ${collection_id}.`, time: now() });
        }

        console.error(`[${now()}] | Failed to update material in Collection ${collection_id}.`);
        return res.status(500).json({ message: `Failed to update material in Collection ${collection_id}.`, time: now() });
    } catch (err) {
        console.error(`[${now()}] | ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error', time: now() });
    }
};

const changeMaterialOrdinal = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { collection_id, material_id_1, material_id_2 } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] | 'aid' is required.`);
            return res.status(400).json({ message: `'aid' is required.`, time: now() });
        }

        if (!role) {
            console.error(`[${now()}] | 'role' is required.`);
            return res.status(400).json({ message: `'role' is required.`, time: now() });
        }

        const result = await tryChangeMaterialOrdinal(aid, role, collection_id, material_id_1, material_id_2);

        if (result === 'BANNED') {
            console.error(`[${now()}] | User ${aid} is banned from changing material ordinals.`);
            return res.status(403).json({ message: `User ${aid} is banned from changing material ordinals.`, time: now() });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] | User ID ${aid} not found.`);
            return res.status(404).json({ message: `User ID ${aid} not found.`, time: now() });
        }

        if (result === 'U_CID') {
            console.error(`[${now()}] | Collection ${collection_id} does not exist.`);
            return res.status(404).json({ message: `Collection ${collection_id} does not exist.`, time: now() });
        }

        if (result === 'U_ORD') {
            console.error(`[${now()}] | One or both materials do not exist in Collection ${collection_id}.`);
            return res.status(404).json({ message: `One or both materials do not exist in Collection ${collection_id}.`, time: now() });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] | Material ordinals changed successfully in Collection ${collection_id}.`);
            return res.status(200).json({ message: `Material ordinals changed successfully in Collection ${collection_id}.`, time: now() });
        }

        console.error(`[${now()}] | Failed to change material ordinals in Collection ${collection_id}.`);
        return res.status(500).json({ message: `Failed to change material ordinals in Collection ${collection_id}.`, time: now() });
    } catch (err) {
        console.error(`[${now()}] | ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error', time: now() });
    }
};

module.exports = { updateMaterial, changeMaterialOrdinal };
