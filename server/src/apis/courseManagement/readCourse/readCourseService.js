const { queryDB } = require('../../database/queryDBService');

const tryReadCourse = async (userType, index) => {
    try {
        // Query for the course details
        const queryStringCourse = `
        SELECT TOP 1 [course_id],
            [course_name],
            [course_description],
            [duration],
            [created_date],
            [user_id]
        FROM [Courses]
        WHERE [course_id] = @index
           OR [course_name] = @index
        `;

        const paramsCourse = { index };

        const resultCourse = await queryDB(userType, queryStringCourse, paramsCourse);

        if (!resultCourse || resultCourse.length === 0)
            throw Error('Course not found.');

        const queryStringModule = `
        SELECT [module_id],
	        [module_ordinal],
	        [module_name],
	        [module_description],
	        [created_date] ,
	        [course_id]
        FROM [Modules]
        WHERE [course_id] = @course_id
        `;

        const paramsModule = { course_id: resultCourse[0]['course_id'] };

        const resultModule= await queryDB(userType, queryStringModule, paramsModule);

        const result = {
            ...resultCourse[0],
            modules: resultModule
        };

        return result;

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at readCourseService.js/tryReadCourse() | {\n${err.message}\n}`);
        return null;
    }
};

module.exports = { tryReadCourse };