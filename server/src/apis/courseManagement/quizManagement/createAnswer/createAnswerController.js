// createAnswerController.js
const { tryCreateAnswer } = require('./createAnswerService');
const now = () => new Date().toLocaleString();

const createAnswer = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { answer_description, answer_is_right, question_id } = req.query;

        if (!aid || Number.isNaN(aid)) {
            console.error(`[${now()}] at createAnswerController.js/createAnswer | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at createAnswerController.js/createAnswer | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryCreateAnswer(aid, role, answer_description, answer_is_right, question_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] at createAnswerController.js/createAnswer | User ${aid} is banned.`);
            return res.status(403).json({
                message: `User ${aid} is banned.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at createAnswerController.js/createAnswer | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_QID') {
            console.error(`[${now()}] at createAnswerController.js/createAnswer | Question ${question_id} does not exist.`);
            return res.status(404).json({
                message: `Question ${question_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at createAnswerController.js/createAnswer | Answer created successfully.`);
            return res.status(200).json({
                message: `Answer created successfully.`,
                time: now()
            });
        }

        console.error(`[${now()}] at createAnswerController.js/createAnswer | Failed to create answer.`);
        return res.status(500).json({
            message: `Failed to create answer.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at createAnswerController.js/createAnswer | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { createAnswer };
