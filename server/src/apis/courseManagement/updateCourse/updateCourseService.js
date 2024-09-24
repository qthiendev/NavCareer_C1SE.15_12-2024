const { queryDB } = require('../../database/queryDBService');
const now = new Date();

const tryCreateCourse = async (userType, course_id, course_name, course_description, duration, created_date, user_id) => {
    try {
        const queryString = `
            update [Courses]
            set course_name = @course_name,
                course_description = @course_description,
                duration = @duration,
                created_date = convert(date, @created_date),
                user_id = @user_id
            where course_id = @course_id
        `;

        const params = {
            course_name: course_name,
            course_description: course_description,
            duration: duration,
            created_date: created_date,
            user_id: user_id,
            course_id: course_id
        };

        await queryDB(userType, queryString, params);

        return true;

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at createCourseService.js/tryCreateCourse() | {\n${err.message}\n}`);
        return false;
    }
};

module.exports = { tryCreateCourse };