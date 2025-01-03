const ncdb = require('../../../databases/ncdbService');

const tryDeleteAnswer = async (aid, role, answer_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(answer_id)) throw new Error(`'answer_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE DeleteAnswer @aid, @answer_id`,
            {
                aid: Number(aid),
                answer_id: Number(answer_id)
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`deleteAnswerService.js/tryDeleteAnswer | ${err.message}`);
    }
};

module.exports = { tryDeleteAnswer };
