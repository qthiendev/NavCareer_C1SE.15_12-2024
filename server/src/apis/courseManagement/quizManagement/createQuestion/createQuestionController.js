// createQuestionController.js
const { tryCreateQuestion } = require('./createQuestionService');
const now = () => new Date().toLocaleString();

const createQuestion = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { question_description, question_type_id, material_id } = req.query;

        if (!aid || Number.isNaN(aid)) {
            console.error(`[${now()}] at createQuestionController.js/createQuestion | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at createQuestionController.js/createQuestion | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryCreateQuestion(aid, role, question_description, question_type_id, material_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] at createQuestionController.js/createQuestion | User ${aid} is banned.`);
            return res.status(403).json({
                message: `User ${aid} is banned.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at createQuestionController.js/createQuestion | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_MID') {
            console.error(`[${now()}] at createQuestionController.js/createQuestion | Material ${material_id} does not exist.`);
            return res.status(404).json({
                message: `Material ${material_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at createQuestionController.js/createQuestion | Question created successfully.`);
            return res.status(200).json({
                message: `Question created successfully.`,
                time: now()
            });
        }

        console.error(`[${now()}] at createQuestionController.js/createQuestion | Failed to create question.`);
        return res.status(500).json({
            message: `Failed to create question.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at createQuestionController.js/createQuestion | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { createQuestion };
