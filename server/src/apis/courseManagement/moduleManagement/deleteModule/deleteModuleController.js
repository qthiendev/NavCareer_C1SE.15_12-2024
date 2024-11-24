// deleteModuleController.js
const { tryDeleteModule } = require('./deleteModuleService');
const now = () => new Date().toLocaleString();

const deleteModule = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { course_id, module_id } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] at deleteModuleController.js/deleteModule | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at deleteModuleController.js/deleteModule | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryDeleteModule(aid, role, course_id, module_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] at deleteModuleController.js/deleteModule | User ${aid} is banned from deleting modules.`);
            return res.status(403).json({
                message: `User ${aid} is banned from deleting modules.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at deleteModuleController.js/deleteModule | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_CID') {
            console.error(`[${now()}] at deleteModuleController.js/deleteModule | Course ${course_id} does not exist or does not belong to User ${aid}.`);
            return res.status(404).json({
                message: `Course ${course_id} does not exist or does not belong to User ${aid}.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at deleteModuleController.js/deleteModule | Module ID ${module_id} deleted successfully from Course ${course_id}.`);
            return res.status(200).json({
                message: `Module ID ${module_id} deleted successfully from Course ${course_id}.`,
                time: now()
            });
        }

        console.error(`[${now()}] at deleteModuleController.js/deleteModule | Failed to delete Module ID ${module_id} from Course ${course_id}.`);
        return res.status(500).json({
            message: `Failed to delete Module ID ${module_id} from Course ${course_id}.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at deleteModuleController.js/deleteModule | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { deleteModule };