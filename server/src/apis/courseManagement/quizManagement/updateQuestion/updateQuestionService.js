const ncdb = require('../../../databases/ncdbService');

const tryUpdateQuestion = async (aid, role, question_id, question_description, question_type_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(question_id)) throw new Error(`'question_id' is required.`);
        if (!question_description || !question_description.trim()) throw new Error(`'question_description' cannot be empty.`);
        if (Number.isNaN(question_type_id)) throw new Error(`'question_type_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE UpdateQuestion @aid, @question_id, @question_description, @question_type_id`,
            {
                aid: Number(aid),
                question_id: Number(question_id),
                question_description: question_description.trim(),
                question_type_id: Number(question_type_id)
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`updateQuestionService.js/tryUpdateQuestion | ${err.message}`);
    }
};

module.exports = { tryUpdateQuestion };
