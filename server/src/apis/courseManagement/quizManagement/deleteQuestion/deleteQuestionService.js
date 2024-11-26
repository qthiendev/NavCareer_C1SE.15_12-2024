const ncdb = require('../../../databases/ncdbService');

const tryDeleteQuestion = async (aid, role, question_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(question_id)) throw new Error(`'question_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE DeleteQuestion @aid, @question_id`,
            {
                aid: Number(aid),
                question_id: Number(question_id)
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`deleteQuestionService.js/tryDeleteQuestion | ${err.message}`);
    }
};

module.exports = { tryDeleteQuestion };
