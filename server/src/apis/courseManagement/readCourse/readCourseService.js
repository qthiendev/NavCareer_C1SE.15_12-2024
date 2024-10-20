const ncbd = require('../../databases/ncdbService');

const tryReadCourse = async (role, courses_id) => {
    try {
        if (Number.isNaN(courses_id))
            throw new Error(`'courses_id' must provided.`);

        const courses = await ncbd.query(role, `execute ReadCourse @courses_id`, { courses_id: courses_id });
        
        if (!courses || courses.length === 0) 
            return null;
        
        // Destructure the object and exclude `module_name`
        const { module_ordinal, module_name, ...courseDetails } = courses[0];
        
        const course = {
            ...courseDetails,
            modules: courses.filter(row => row.module_name != null).map(module => ({
                module_ordinal: module.module_ordinal,
                module_name: module.module_name,
            }))
        };

        return course;

    } catch (err) {
        throw new Error(`readCourseService.js/tryReadCourse| ${err.message}`);
    }
};


module.exports = { tryReadCourse };