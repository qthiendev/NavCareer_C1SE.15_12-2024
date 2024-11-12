const ncdb = require('../../../databases/ncdbService');

const tryReadGrade = async (aid, role, enrollment_id, module_id) => {
    try {
        const result = await ncdb.query(role,
            'EXECUTE ReadGrade @aid, @enrollment_id, @module_id',
            { aid, enrollment_id, module_id }
        );

        if (!result)
            throw new Error(`Cannot get grade of enrollment[${enrollment_id}], module[${module_id}]`);

        return result;
    } catch (err) {
        throw new Error(`gradingService.js/tryReadGrade | ${err.message}`);
    }
}

const tryCreateGrade = async (aid, role, enrollment_id, module_id, grade) => {
    try {
        const result = await ncdb.query(role,
            'EXECUTE CreateGrade @aid, @enrollment_id, @module_id, @grade',
            { aid, enrollment_id, module_id, grade }
        );

        if (!result || result.length < 1)
            throw new Error(`Cannot create grade of enrollment[${enrollment_id}], module[${module_id}]`);

        return result[0].check;
    } catch (err) {
        throw new Error(`gradingService.js/tryReadGrade | ${err.message}`);
    }
}

module.exports = { tryReadGrade, tryCreateGrade };