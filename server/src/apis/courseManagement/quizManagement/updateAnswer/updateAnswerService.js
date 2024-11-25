// updateAnswerService.js
const ncdb = require('../../../databases/ncdbService');

const tryUpdateAnswer = async (aid, role, answer_id, answer_description, answer_is_right) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(answer_id)) throw new Error(`'answer_id' is required.`);
        if (!answer_description || !answer_description.trim()) throw new Error(`'answer_description' cannot be empty.`);
        if (answer_is_right === undefined) throw new Error(`'answer_is_right' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE UpdateAnswer @aid, @answer_id, @answer_description, @answer_is_right`,
            {
                aid: Number(aid),
                answer_id: Number(answer_id),
                answer_description: answer_description.trim(),
                answer_is_right: Boolean(answer_is_right)
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`updateAnswerService.js/tryUpdateAnswer | ${err.message}`);
    }
};

const tryChangeAnswerOrdinal = async (aid, role, answer_id_1, answer_id_2, question_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(answer_id_1) || Number.isNaN(answer_id_2)) throw new Error(`'answer_id_1' and 'answer_id_2' are required.`);
        if (Number.isNaN(question_id)) throw new Error(`'question_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE ChangeAnswerOrdinal @aid, @answer_id_1, @answer_id_2, @question_id`,
            {
                aid: Number(aid),
                answer_id_1: Number(answer_id_1),
                answer_id_2: Number(answer_id_2),
                question_id: Number(question_id)
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`updateAnswerService.js/tryChangeAnswerOrdinal | ${err.message}`);
    }
};

module.exports = { tryUpdateAnswer, tryChangeAnswerOrdinal };
