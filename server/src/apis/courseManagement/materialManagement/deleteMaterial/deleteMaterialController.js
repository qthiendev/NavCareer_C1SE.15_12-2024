// deleteMaterialController.js
const { tryDeleteMaterial } = require('./deleteMaterialService');
const now = () => new Date().toLocaleString();

const deleteMaterial = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { collection_id, material_id } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] | 'aid' is required.`);
            return res.status(400).json({ message: `'aid' is required.`, time: now() });
        }

        if (!role) {
            console.error(`[${now()}] | 'role' is required.`);
            return res.status(400).json({ message: `'role' is required.`, time: now() });
        }

        const result = await tryDeleteMaterial(aid, role, collection_id, material_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] | User ${aid} is banned from deleting materials.`);
            return res.status(403).json({ message: `User ${aid} is banned from deleting materials.`, time: now() });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] | User ID ${aid} not found.`);
            return res.status(404).json({ message: `User ID ${aid} not found.`, time: now() });
        }

        if (result === 'U_MID') {
            console.error(`[${now()}] | Collection ${collection_id} does not exist.`);
            return res.status(404).json({ message: `Collection ${collection_id} does not exist.`, time: now() });
        }

        if (result === 'U_CID') {
            console.error(`[${now()}] | Material ${material_id} does not exist.`);
            return res.status(404).json({ message: `Material ${material_id} does not exist.`, time: now() });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] | Material ${material_id} deleted successfully from Collection ${collection_id}.`);
            return res.status(200).json({ message: `Material ${material_id} deleted successfully from Collection ${collection_id}.`, time: now() });
        }

        console.error(`[${now()}] | Failed to delete Material ${material_id} from Collection ${collection_id}.`);
        return res.status(500).json({ message: `Failed to delete Material ${material_id} from Collection ${collection_id}.`, time: now() });
    } catch (err) {
        console.error(`[${now()}] | ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error', time: now() });
    }
};

module.exports = { deleteMaterial };
