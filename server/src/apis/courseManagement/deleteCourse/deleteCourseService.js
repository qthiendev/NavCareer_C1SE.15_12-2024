const ncbd = require('../../databases/ncdbService');

const tryDeleteCourse = async (aid, course_id) => {
    try {
        if (Number.isNaN(aid)) 
            throw new Error(`'aid' must provided.`);
        
        if (Number.isNaN(course_id)) 
            throw new Error(`'course_id' must provided.`);

        // Calling the stored procedure to delete the course
        const deleteCourse = await ncbd.query('NAV_ESP', 
            `execute DeleteCourse @aid, @course_id`, 
            {
                aid: aid,
                course_id: course_id
            });

        return deleteCourse[0].check;

    } catch (err) {
        throw new Error(`deleteCourseService.js/tryDeleteCourse | ${err.message}`);
    }
};

module.exports = { tryDeleteCourse };
