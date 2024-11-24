// createMaterialController.js
const { tryCreateMaterial } = require('./createMaterialService');
const now = () => new Date().toLocaleString();

const createMaterial = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { material_content, material_type_id, collection_id } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] at createMaterialController.js/createMaterial | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at createMaterialController.js/createMaterial | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryCreateMaterial(aid, role, material_content, material_type_id, collection_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] at createMaterialController.js/createMaterial | User ${aid} is banned from creating materials.`);
            return res.status(403).json({
                message: `User ${aid} is banned from creating materials.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at createMaterialController.js/createMaterial | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_CID') {
            console.error(`[${now()}] at createMaterialController.js/createMaterial | Collection ${collection_id} does not exist.`);
            return res.status(404).json({
                message: `Collection ${collection_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at createMaterialController.js/createMaterial | Material created successfully in Collection ${collection_id}.`);
            return res.status(200).json({
                message: `Material created successfully in Collection ${collection_id}.`,
                time: now()
            });
        }

        console.error(`[${now()}] at createMaterialController.js/createMaterial | Failed to create material in Collection ${collection_id}.`);
        return res.status(500).json({
            message: `Failed to create material in Collection ${collection_id}.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at createMaterialController.js/createMaterial | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { createMaterial };
