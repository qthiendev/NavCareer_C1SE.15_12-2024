// createModuleService.js
const ncdb = require('../../../databases/ncdbService');

const tryCreateModule = async (aid, role, module_name, course_id) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (!module_name || !module_name.trim()) throw new Error(`'module_name' cannot be empty.`);
        if (Number.isNaN(course_id)) throw new Error(`'course_id' is required.`);

        const result = await ncdb.query(
            role,
            `EXECUTE CreateModule @aid, @module_name, @course_id`,
            {
                aid: Number(aid),
                module_name: module_name.trim(),
                course_id: Number(course_id)
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`createModuleService.js/tryCreateModule | ${err.message}`);
    }
};

module.exports = { tryCreateModule };
