const ncdb = require('../../databases/ncdbService');

const tryCreateCourse = async (aid, role, courseId, newName, newDescription, newDuration) => {
    try {
        const results = await ncdb.query(role,
            'EXECUTE UpdateCourse @aid, @course_id, @new_course_name, @new_course_description, @new_duration',
            { aid: aid, course_id: courseId, new_course_name: newName, new_course_description: newDescription, new_duration: newDuration });

        return results && results.length > 0;

    } catch (err) {
        throw new Error(`updateCourseService.js/tryUpdateCourse| ${err.message}`);
    }
};

module.exports = { tryCreateCourse };