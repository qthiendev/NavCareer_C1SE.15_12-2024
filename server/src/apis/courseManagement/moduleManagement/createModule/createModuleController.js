// createModuleController.js
const { tryCreateModule } = require('./createModuleService');
const now = () => new Date().toLocaleString();

const createModule = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { module_name, course_id } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] at createModuleController.js/createModule | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at createModuleController.js/createModule | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryCreateModule(aid, role, module_name, course_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] at createModuleController.js/createModule | User ${aid} is banned from creating modules.`);
            return res.status(403).json({
                message: `User ${aid} is banned from creating modules.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at createModuleController.js/createModule | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_CID') {
            console.error(`[${now()}] at createModuleController.js/createModule | Course ${course_id} does not exist or does not belong to User ${aid}.`);
            return res.status(404).json({
                message: `Course ${course_id} does not exist or does not belong to User ${aid}.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at createModuleController.js/createModule | Module '${module_name}' created successfully for Course ${course_id}.`);
            return res.status(200).json({
                message: `Module '${module_name}' created successfully for Course ${course_id}.`,
                time: now()
            });
        }

        console.error(`[${now()}] at createModuleController.js/createModule | Failed to create module '${module_name}' for Course ${course_id}.`);
        return res.status(500).json({
            message: `Failed to create module '${module_name}' for Course ${course_id}.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at createModuleController.js/createModule | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { createModule };
