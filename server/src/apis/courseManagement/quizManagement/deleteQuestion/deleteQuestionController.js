const { tryDeleteQuestion } = require('./deleteQuestionService');
const now = () => new Date().toLocaleString();

const deleteQuestion = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { question_id } = req.query;

        if (!aid || Number.isNaN(aid)) {
            console.error(`[${now()}] at deleteQuestionController.js/deleteQuestion | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at deleteQuestionController.js/deleteQuestion | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryDeleteQuestion(aid, role, question_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] at deleteQuestionController.js/deleteQuestion | User ${aid} is banned.`);
            return res.status(403).json({
                message: `User ${aid} is banned.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at deleteQuestionController.js/deleteQuestion | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_QID') {
            console.error(`[${now()}] at deleteQuestionController.js/deleteQuestion | Question ${question_id} does not exist.`);
            return res.status(404).json({
                message: `Question ${question_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at deleteQuestionController.js/deleteQuestion | Question ${question_id} deleted successfully.`);
            return res.status(200).json({
                message: `Question ${question_id} deleted successfully.`,
                time: now()
            });
        }

        console.error(`[${now()}] at deleteQuestionController.js/deleteQuestion | Failed to delete question ${question_id}.`);
        return res.status(500).json({
            message: `Failed to delete question ${question_id}.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at deleteQuestionController.js/deleteQuestion | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { deleteQuestion };
