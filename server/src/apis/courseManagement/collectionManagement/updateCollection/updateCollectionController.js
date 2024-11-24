const { tryUpdateCollection, tryChangeCollectionOrdinal } = require('./updateCollectionService');
const now = () => new Date().toLocaleString();

const updateCollection = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { module_id, collection_id, collection_name, collection_type_id } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] at updateCollectionController.js/updateCollection | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at updateCollectionController.js/updateCollection | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryUpdateCollection(aid, role, module_id, collection_id, collection_name, collection_type_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] at updateCollectionController.js/updateCollection | User ${aid} is banned from updating collections.`);
            return res.status(403).json({
                message: `User ${aid} is banned from updating collections.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at updateCollectionController.js/updateCollection | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_MID') {
            console.error(`[${now()}] at updateCollectionController.js/updateCollection | Module ${module_id} does not exist.`);
            return res.status(404).json({
                message: `Module ${module_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'U_CID') {
            console.error(`[${now()}] at updateCollectionController.js/updateCollection | Collection ${collection_id} does not exist.`);
            return res.status(404).json({
                message: `Collection ${collection_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at updateCollectionController.js/updateCollection | Collection '${collection_name}' updated successfully in Module ${module_id}.`);
            return res.status(200).json({
                message: `Collection '${collection_name}' updated successfully in Module ${module_id}.`,
                time: now()
            });
        }

        console.error(`[${now()}] at updateCollectionController.js/updateCollection | Failed to update collection '${collection_name}' in Module ${module_id}.`);
        return res.status(500).json({
            message: `Failed to update collection '${collection_name}' in Module ${module_id}.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at updateCollectionController.js/updateCollection | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

const changeCollectionOrdinal = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { module_id, collection_id_1, collection_id_2 } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] at updateCollectionController.js/changeCollectionOrdinal | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at updateCollectionController.js/changeCollectionOrdinal | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryChangeCollectionOrdinal(aid, role, module_id, collection_id_1, collection_id_2);

        if (result === 'BANNED') {
            console.error(`[${now()}] at updateCollectionController.js/changeCollectionOrdinal | User ${aid} is banned from changing collection ordinals.`);
            return res.status(403).json({
                message: `User ${aid} is banned from changing collection ordinals.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at updateCollectionController.js/changeCollectionOrdinal | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_MID') {
            console.error(`[${now()}] at updateCollectionController.js/changeCollectionOrdinal | Module ${module_id} does not exist.`);
            return res.status(404).json({
                message: `Module ${module_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'U_ORD') {
            console.error(`[${now()}] at updateCollectionController.js/changeCollectionOrdinal | One or both collections do not exist in Module ${module_id}.`);
            return res.status(404).json({
                message: `One or both collections do not exist in Module ${module_id}.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at updateCollectionController.js/changeCollectionOrdinal | Collection ordinals updated successfully in Module ${module_id}.`);
            return res.status(200).json({
                message: `Collection ordinals updated successfully in Module ${module_id}.`,
                time: now()
            });
        }

        console.error(`[${now()}] at updateCollectionController.js/changeCollectionOrdinal | Failed to update collection ordinals in Module ${module_id}.`);
        return res.status(500).json({
            message: `Failed to update collection ordinals in Module ${module_id}.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at updateCollectionController.js/changeCollectionOrdinal | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { updateCollection, changeCollectionOrdinal };
