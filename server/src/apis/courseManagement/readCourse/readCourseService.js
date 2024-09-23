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

        const queryStringMaterial = `
        SELECT [material_name],
            [material_description]
        FROM [CourseMaterials]
        WHERE [course_id] = @course_id
        `;

        const paramsMaterial = { course_id: resultCourse[0]['course_id'] };

        const resultMaterial = await queryDB(userType, queryStringMaterial, paramsMaterial);

        const result = {
            ...resultCourse[0],
            materials: resultMaterial
        };

        return result;

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at readCourseService.js/tryReadCourse() | {\n${err.message}\n}`);
        return null;
    }
};

module.exports = { tryReadCourse };