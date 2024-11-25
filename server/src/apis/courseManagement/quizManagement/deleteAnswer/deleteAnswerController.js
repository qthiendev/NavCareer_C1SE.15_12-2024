const { tryDeleteAnswer } = require('./deleteAnswerService');
const now = () => new Date().toLocaleString();

const deleteAnswer = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { answer_id } = req.query;

        if (!aid || Number.isNaN(aid)) {
            console.error(`[${now()}] at deleteAnswerController.js/deleteAnswer | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at deleteAnswerController.js/deleteAnswer | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryDeleteAnswer(aid, role, answer_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] at deleteAnswerController.js/deleteAnswer | User ${aid} is banned.`);
            return res.status(403).json({
                message: `User ${aid} is banned.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at deleteAnswerController.js/deleteAnswer | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_AID') {
            console.error(`[${now()}] at deleteAnswerController.js/deleteAnswer | Answer ${answer_id} does not exist.`);
            return res.status(404).json({
                message: `Answer ${answer_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at deleteAnswerController.js/deleteAnswer | Answer ${answer_id} deleted successfully.`);
            return res.status(200).json({
                message: `Answer ${answer_id} deleted successfully.`,
                time: now()
            });
        }

        console.error(`[${now()}] at deleteAnswerController.js/deleteAnswer | Failed to delete answer ${answer_id}.`);
        return res.status(500).json({
            message: `Failed to delete answer ${answer_id}.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at deleteAnswerController.js/deleteAnswer | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { deleteAnswer };
