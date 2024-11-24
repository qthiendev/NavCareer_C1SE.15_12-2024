const { tryUpdateModule } = require('./updateModuleService');
const now = () => new Date().toLocaleString();

const updateModule = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { course_id, module_id, module_name } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] at updateModuleController.js/updateModule | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at updateModuleController.js/updateModule | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryUpdateModule(aid, role, course_id, module_id, module_name);

        if (result === 'BANNED') {
            console.error(`[${now()}] at updateModuleController.js/updateModule | User ${aid} is banned from updating modules.`);
            return res.status(403).json({
                message: `User ${aid} is banned from updating modules.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at updateModuleController.js/updateModule | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_CID') {
            console.error(`[${now()}] at updateModuleController.js/updateModule | Course ${course_id} does not exist or does not belong to User ${aid}.`);
            return res.status(404).json({
                message: `Course ${course_id} does not exist or does not belong to User ${aid}.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at updateModuleController.js/updateModule | Module '${module_name}' updated successfully for Course ${course_id}.`);
            return res.status(200).json({
                message: `Module '${module_name}' updated successfully for Course ${course_id}.`,
                time: now()
            });
        }

        console.error(`[${now()}] at updateModuleController.js/updateModule | Failed to update module '${module_name}' for Course ${course_id}.`);
        return res.status(500).json({
            message: `Failed to update module '${module_name}' for Course ${course_id}.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at updateModuleController.js/updateModule | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { updateModule };
