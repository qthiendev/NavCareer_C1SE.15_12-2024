const ncdb = require('../../../databases/ncdbService');

const tryDeleteModule = async (aid, role, course_id, module_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(course_id)) throw new Error(`'course_id' is required.`);
        if (Number.isNaN(module_id)) throw new Error(`'module_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE DeleteModule @aid, @course_id, @module_id`,
            {
                aid: Number(aid),
                course_id: Number(course_id),
                module_id: Number(module_id),
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`deleteModuleService.js/tryDeleteModule | ${err.message}`);
    }
};

module.exports = { tryDeleteModule };