const ncdb = require('../../../databases/ncdbService');

const tryUpdateModule = async (aid, role, course_id, module_id, module_name) => {
    try {
        if (Number.isNaN(aid)) throw new Error(`'aid' is required.`);
        if (!role) throw new Error(`'role' is required.`);
        if (Number.isNaN(course_id)) throw new Error(`'course_id' is required.`);
        if (Number.isNaN(module_id)) throw new Error(`'module_id' is required.`);
        if (!module_name || !module_name.trim()) throw new Error(`'module_name' cannot be empty.`);

        const result = await ncdb.query(
            role,
            `EXECUTE UpdateModule @aid, @course_id, @module_id, @module_name`,
            {
                aid: Number(aid),
                course_id: Number(course_id),
                module_id: Number(module_id),
                module_name: module_name.trim(),
            }
        );

        if (!result || result.length === 0) {
            throw new Error('No response from the database.');
        }

        return result[0].check;
    } catch (err) {
        throw new Error(`updateModuleService.js/tryUpdateModule | ${err.message}`);
    }
};

module.exports = { tryUpdateModule };