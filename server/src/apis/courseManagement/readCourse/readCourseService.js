const { queryDB } = require('../../database/queryDBService');

const tryReadCourse = async (userType, course_id) => {
    try {
        const isNumeric = !isNaN(course_id);

        const queryString = `execute ReadCourse @course_id`;

        const params = { course_id: course_id };

        const result = await queryDB(userType, queryString, params);

        if (!result || result.length === 0) {
            throw new Error('Course not found.');
        }

        const courseDetails = {
            course_id: result[0].course_id,
            course_name: result[0].course_name,
            course_description: result[0].course_description,
            duration: result[0].duration,
            created_date: result[0].created_date,
            user_id: result[0].user_id,
            modules: result.filter(row => row.module_id != null).map(module => ({
                module_id: module.module_id,
                module_ordinal: module.module_ordinal,
                module_name: module.module_name,
                module_description: module.module_description,
                created_date: module.module_created_date
            }))
        };

        return courseDetails;

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at readCourseService.js/tryReadCourse() | {\n${err.message}\n}`);
        return null;
    }
};

module.exports = { tryReadCourse };