const ncbd = require('../../databases/ncdbService');

const tryDeleteCourse = async (aid, role, course_id) => {
    try {
        if (Number.isNaN(course_id))
            throw new Error(`'course_id' must provided.`);

        const result = await ncbd.query(role,
            `execute DeleteCourse @aid, @course_id`,
            { aid: aid, course_id: course_id });

        return result && result.length === 0;

    } catch (err) {
        throw new Error(`readCourseService.js/tryReadCourse| ${err.message}`);
    }
};

module.exports = { tryDeleteCourse };   