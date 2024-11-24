const { tryDeleteCollection } = require('./deleteCollectionService');
const now = () => new Date().toLocaleString();

const deleteCollection = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { module_id, collection_id } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] at deleteCollectionController.js/deleteCollection | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at deleteCollectionController.js/deleteCollection | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryDeleteCollection(aid, role, module_id, collection_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] at deleteCollectionController.js/deleteCollection | User ${aid} is banned from deleting collections.`);
            return res.status(403).json({
                message: `User ${aid} is banned from deleting collections.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at deleteCollectionController.js/deleteCollection | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_MID') {
            console.error(`[${now()}] at deleteCollectionController.js/deleteCollection | Module ${module_id} does not exist.`);
            return res.status(404).json({
                message: `Module ${module_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'U_CID') {
            console.error(`[${now()}] at deleteCollectionController.js/deleteCollection | Collection ${collection_id} does not exist.`);
            return res.status(404).json({
                message: `Collection ${collection_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at deleteCollectionController.js/deleteCollection | Collection ID ${collection_id} deleted successfully from Module ${module_id}.`);
            return res.status(200).json({
                message: `Collection ID ${collection_id} deleted successfully from Module ${module_id}.`,
                time: now()
            });
        }

        console.error(`[${now()}] at deleteCollectionController.js/deleteCollection | Failed to delete Collection ID ${collection_id} from Module ${module_id}.`);
        return res.status(500).json({
            message: `Failed to delete Collection ID ${collection_id} from Module ${module_id}.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at deleteCollectionController.js/deleteCollection | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { deleteCollection };
