const ncdb = require('../../../databases/ncdbService');

const tryCreateQuestion = async (aid, role, question_description, question_type_id, material_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (!question_description || !question_description.trim()) throw new Error(`'question_description' cannot be empty.`);
        if (Number.isNaN(question_type_id)) throw new Error(`'question_type_id' is required.`);
        if (Number.isNaN(material_id)) throw new Error(`'material_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE CreateQuestion @aid, @material_id, @question_description, @question_type_id`,
            {
                aid: Number(aid),
                question_description: question_description.trim(),
                question_type_id: Number(question_type_id),
                material_id: Number(material_id)
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`createQuestionService.js/tryCreateQuestion | ${err.message}`);
    }
};

module.exports = { tryCreateQuestion };
