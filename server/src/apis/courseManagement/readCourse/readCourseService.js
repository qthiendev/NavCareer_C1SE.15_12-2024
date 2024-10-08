const ncbd = require('../../databases/ncdbService');

const tryReadCourse = async (role, course_id) => {
    try {

        if (Number.isNaN(course_id))
            throw new Error(`'course_id' must provided.`);

        const result = await ncbd.query(role, `execute ReadCourse @course_id`, { course_id: course_id });

        if (!result || result.length === 0) {
            throw new Error('Course not found.');
        }

        const courseDetails = {
            provider_name: result[0].user_full_name,
            provider_birthdate: result[0].birthdate,
            provider_email: result[0].email,
            provider_phone_number: result[0].phone_number,
            course_name: result[0].course_name,
            course_description: result[0].course_description,
            duration: result[0].duration,
            modules: result.filter(row => row.module_name != null).map(module => ({
                module_ordinal: module.module_ordinal,
                module_name: module.module_name,
            }))
        };        

        return courseDetails;

    } catch (err) {
        throw new Error(`readCourseService.js/tryReadCourse| ${err.message}`);
    }
};

module.exports = { tryReadCourse };