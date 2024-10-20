const ncdb = require('../../databases/ncdbService');

const tryCreateCourse = async (aid, role, course_id, course_name, course_short_description, course_full_description, course_price, course_duration, course_status) => {
    try {
        if (Number.isNaN(aid))
            throw new Error(`'aid' is required.`);

        if (!role)
            throw new Error(`'role' is required.`);

        if (Number.isNaN(course_id))
            throw new Error(`'course_id' is required.`);

        if (!course_short_description)
            throw new Error(`'account' is empty or invalid.`);

        if (!course_full_description)
            throw new Error(`'password' is empty or invalid.`);

        if (!course_price)
            throw new Error(`'duration' is empty or invalid.`);

        if (!course_duration)
            throw new Error(`'duration' is empty or invalid.`);

        if (Number.isNaN(course_status))
            throw new Error(`'aid' is required.`);
        
        const updateCourse = await ncdb.query(role,
            `EXECUTE UpdateCourse @aid, @course_id, @course_name, @course_short_description, @course_full_description, @course_price, @course_duration, @course_status`,
            { aid, course_id, course_name, course_short_description, course_full_description, course_price, course_duration, course_status });

        return updateCourse[0].check;

    } catch (err) {
        throw new Error(`updateCourseService.js/tryUpdateCourse| ${err.message}`);
    }
};

module.exports = { tryCreateCourse };