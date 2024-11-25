const ncdb = require('../../../databases/ncdbService');

const tryCreateAnswer = async (aid, role, answer_description, answer_is_right, question_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (!answer_description || !answer_description.trim()) throw new Error(`'answer_description' cannot be empty.`);
        if (answer_is_right === undefined) throw new Error(`'answer_is_right' is required.`);
        if (Number.isNaN(question_id)) throw new Error(`'question_id' is required.`);

        if (answer_is_right === true || answer_is_right === 'true')
            answer_is_right = 1;
        else
            answer_is_right = 0;

        const result = await ncdb.query(
            role,
            `EXECUTE CreateAnswer @aid, @question_id, @answer_description, @answer_is_right`,
            {
                aid,
                answer_description,
                answer_is_right: answer_is_right,
                question_id: question_id,
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`createAnswerService.js/tryCreateAnswer | ${err.message}`);
    }
};

module.exports = { tryCreateAnswer };
