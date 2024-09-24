const { queryDB } = require('../../database/queryDBService');
const now = new Date();

const tryCreateCourse = async (userType, course_name, course_description, duration, user_id) => {
    try {
        const latestIDResult = await queryDB(
            userType,
            `SELECT TOP 1 course_id FROM Courses ORDER BY course_id DESC`,
            {}
        ) || [];

        const latestID = (latestIDResult.length > 0) ? latestIDResult[0].course_id : 0;
        console.log(latestID)
        const newID = parseInt(latestID) + 1;

        const insertQuery = `
            INSERT INTO Courses ([course_id], [course_name], [course_description], [duration], [created_date], [user_id])
            VALUES (@newID, @course_name, @course_description, @duration, @created_date, @user_id)
        `;

        const params = {
            newID: newID,
            course_name: course_name,
            course_description: course_description,
            duration: duration,
            created_date: now.toISOString(),
            user_id: user_id
        };

        await queryDB(userType, insertQuery, params);

        // Verify
        const checkQuery = `
            SELECT [course_id] FROM Courses 
            WHERE [course_id] = @newID AND [user_id] = @user_id
        `;

        const checkParams = {
            newID: newID,
            user_id: user_id
        };

        const checkResult = await queryDB(userType, checkQuery, checkParams);

        return checkResult.length > 0;

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at createCourseService.js/tryCreateCourse() | {\n${err.message}\n}`);
        return false;
    }
};

module.exports = { tryCreateCourse };