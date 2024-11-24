// createCollectionController.js
const { tryCreateCollection } = require('./createCollectionService');
const now = () => new Date().toLocaleString();

const createCollection = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { collection_name, collection_type_id, module_id } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] at createCollectionController.js/createCollection | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at createCollectionController.js/createCollection | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryCreateCollection(aid, role, collection_name, collection_type_id, module_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] at createCollectionController.js/createCollection | User ${aid} is banned from creating collections.`);
            return res.status(403).json({
                message: `User ${aid} is banned from creating collections.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at createCollectionController.js/createCollection | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_MID') {
            console.error(`[${now()}] at createCollectionController.js/createCollection | Module ${module_id} does not exist.`);
            return res.status(404).json({
                message: `Module ${module_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at createCollectionController.js/createCollection | Collection '${collection_name}' created successfully in Module ${module_id}.`);
            return res.status(200).json({
                message: `Collection '${collection_name}' created successfully in Module ${module_id}.`,
                time: now()
            });
        }

        console.error(`[${now()}] at createCollectionController.js/createCollection | Failed to create collection '${collection_name}' in Module ${module_id}.`);
        return res.status(500).json({
            message: `Failed to create collection '${collection_name}' in Module ${module_id}.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at createCollectionController.js/createCollection | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { createCollection };
