const ncbd = require('../../databases/ncdbService');

const tryCreateCourse = async (aid, role, course_name, course_short_description, course_full_description, course_price, course_duration) => {
    try {

        if (Number.isNaN(aid))
            throw new Error(`'aid' must provided.`);

        if (!role)
            throw new Error(`'role' must provided.`);

        if (!course_name)
            throw new Error(`'course_name' must provided.`);

        if (!course_short_description)
            throw new Error(`'course_short_description' must provided.`);

        if (!course_full_description)
            throw new Error(`'course_full_description' must provided.`);

        if (!course_duration)
            throw new Error(`'course_duration' must provided.`);

        const createCourse = await ncbd.query(role,
            `execute CreateCourse @aid, @course_name, @course_short_description, @course_full_description, @course_price, @course_duration`,
            {
                aid: aid,
                course_name,
                course_short_description,
                course_full_description,
                course_price,
                course_duration
            });

        return createCourse[0].check;

    } catch (err) {
        throw new Error(`createCourseService.js/tryCreateCourse| ${err.message}`);
    }
};

module.exports = { tryCreateCourse };