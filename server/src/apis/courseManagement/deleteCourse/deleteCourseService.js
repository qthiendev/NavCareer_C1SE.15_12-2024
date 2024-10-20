const ncbd = require('../../databases/ncdbService');

const tryDeleteCourse = async (aid, role, course_id) => {
    try {
        if (Number.isNaN(course_id))
            throw new Error(`'course_id' must provided.`);

        const delCourse = await ncbd.query(role,
            `execute DeleteCourse @aid, @course_id`,
            { aid, course_id});

        return delCourse[0].check;

    } catch (err) {
        throw new Error(`deleteCourseService.js/tryDeleteCourse| ${err.message}`);
    }
};

module.exports = { tryDeleteCourse };   