// updateAnswerController.js
const { tryUpdateAnswer, tryChangeAnswerOrdinal } = require('./updateAnswerService');
const now = () => new Date().toLocaleString();

const updateAnswer = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { answer_id, answer_description, answer_is_right } = req.query;

        if (!aid || Number.isNaN(aid)) {
            console.error(`[${now()}] at updateAnswerController.js/updateAnswer | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at updateAnswerController.js/updateAnswer | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryUpdateAnswer(aid, role, answer_id, answer_description, answer_is_right);

        if (result === 'BANNED') {
            console.error(`[${now()}] at updateAnswerController.js/updateAnswer | User ${aid} is banned.`);
            return res.status(403).json({
                message: `User ${aid} is banned.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at updateAnswerController.js/updateAnswer | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_AID') {
            console.error(`[${now()}] at updateAnswerController.js/updateAnswer | Answer ${answer_id} does not exist.`);
            return res.status(404).json({
                message: `Answer ${answer_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at updateAnswerController.js/updateAnswer | Answer ${answer_id} updated successfully.`);
            return res.status(200).json({
                message: `Answer ${answer_id} updated successfully.`,
                time: now()
            });
        }

        console.error(`[${now()}] at updateAnswerController.js/updateAnswer | Failed to update answer ${answer_id}.`);
        return res.status(500).json({
            message: `Failed to update answer ${answer_id}.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at updateAnswerController.js/updateAnswer | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

const changeAnswerOrdinal = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { answer_id_1, answer_id_2, question_id } = req.query;

        if (!aid || Number.isNaN(aid)) {
            console.error(`[${now()}] at updateAnswerController.js/changeAnswerOrdinal | 'aid' is required.`);
            return res.status(400).json({
                message: `'aid' is required.`,
                time: now()
            });
        }

        if (!role) {
            console.error(`[${now()}] at updateAnswerController.js/changeAnswerOrdinal | 'role' is required.`);
            return res.status(400).json({
                message: `'role' is required.`,
                time: now()
            });
        }

        const result = await tryChangeAnswerOrdinal(aid, role, answer_id_1, answer_id_2, question_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] at updateAnswerController.js/changeAnswerOrdinal | User ${aid} is banned.`);
            return res.status(403).json({
                message: `User ${aid} is banned.`,
                time: now()
            });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] at updateAnswerController.js/changeAnswerOrdinal | User ID ${aid} not found.`);
            return res.status(404).json({
                message: `User ID ${aid} not found.`,
                time: now()
            });
        }

        if (result === 'U_QID') {
            console.error(`[${now()}] at updateAnswerController.js/changeAnswerOrdinal | Question ${question_id} does not exist.`);
            return res.status(404).json({
                message: `Question ${question_id} does not exist.`,
                time: now()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] at updateAnswerController.js/changeAnswerOrdinal | Ordinals swapped successfully.`);
            return res.status(200).json({
                message: `Ordinals swapped successfully.`,
                time: now()
            });
        }

        console.error(`[${now()}] at updateAnswerController.js/changeAnswerOrdinal | Failed to swap ordinals.`);
        return res.status(500).json({
            message: `Failed to swap ordinals.`,
            time: now()
        });
    } catch (err) {
        console.error(`[${now()}] at updateAnswerController.js/changeAnswerOrdinal | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now()
        });
    }
};

module.exports = { updateAnswer, changeAnswerOrdinal };
