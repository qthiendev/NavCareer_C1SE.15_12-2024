const ncdb = require('../../databases/ncdbService');

const tryUpdateCourse = async (aid, role, course_id, course_name, course_short_description, course_full_description, course_price, course_duration, course_status) => {
    try {
        if (Number.isNaN(aid))
            throw new Error(`'aid' is required.`);

        if (!role)
            throw new Error(`'role' is required.`);

        if (Number.isNaN(course_id))
            throw new Error(`'course_id' is required.`);

        if (!course_short_description)
            throw new Error(`'course_short_description' is empty or invalid.`);

        if (!course_full_description)
            throw new Error(`'course_full_description' is empty or invalid.`);

        if (Number.isNaN(course_price))
            throw new Error(`'course_price' is required.`);

        if (!course_duration)
            throw new Error(`'course_duration' is empty or invalid.`);

        if (Number.isNaN(course_status))
            throw new Error(`'course_status' is required.`);

        const updateCourse = await ncdb.query(role,
            `EXECUTE UpdateCourse @aid, @course_id, @course_name, @course_short_description, @course_full_description, @course_price, @course_duration, @course_status`,
            {
                aid: Number(aid),
                course_id: Number(course_id),
                course_name,
                course_short_description,
                course_full_description,
                course_price: Number(course_price),
                course_duration,
                course_status: course_status ? 1 : 0
            });

        return updateCourse[0].check;

    } catch (err) {
        throw new Error(`updateCourseService.js/tryUpdateCourse| ${err.message}`);
    }
};

const tryChangeModuleOrdinal = async (aid, role, course_id, module_id_1, module_id_2) => {
    try {

        const results = await ncdb.query(role,
            'EXECUTE ChangeModuleOrdinal @aid, @course_id, @module_id_1, @module_id_2',
            { aid, course_id, module_id_1, module_id_2 }
        );

        if (results === null || results.length < 1)
            throw new Error('Cannot get results');

        return results[0].check;

    } catch (err) {
        throw new Error(`updateCourseService.js/tryChangeModuleOrdinal| ${err.message}`);
    }
}

module.exports = { tryUpdateCourse, tryChangeModuleOrdinal };
