// updateQuestionController.js
const { tryUpdateQuestion } = require('./updateQuestionService');
const now = () => new Date().toLocaleString();

const updateQuestion = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { question_id, question_description, question_type_id } = req.query;

        if (!aid || Number.isNaN(aid)) {
            console.error(`[${now()}] at updateQuestionController.js/updateQuestion | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at updateQuestionController.js/updateQuestion | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryUpdateQuestion(aid, role, question_id, question_description, question_type_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] at updateQuestionController.js/updateQuestion | User ${aid} is banned.`);
            return res.status(403).json({
                message: `User ${aid} is banned.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at updateQuestionController.js/updateQuestion | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_QID') {
            console.error(`[${now()}] at updateQuestionController.js/updateQuestion | Question ${question_id} does not exist.`);
            return res.status(404).json({
                message: `Question ${question_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at updateQuestionController.js/updateQuestion | Question ${question_id} updated successfully.`);
            return res.status(200).json({
                message: `Question ${question_id} updated successfully.`,
                time: now()
            });
        }

        console.error(`[${now()}] at updateQuestionController.js/updateQuestion | Failed to update question ${question_id}.`);
        return res.status(500).json({
            message: `Failed to update question ${question_id}.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at updateQuestionController.js/updateQuestion | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { updateQuestion };
