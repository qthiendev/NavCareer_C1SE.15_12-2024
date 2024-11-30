const ncbd = require('../../../../databases/ncdbService'); // Database connection module

const tryCreateCourseFeedback = async (role, aid, description, courseId) => {
    try {
        console.log(`[${new Date().toLocaleString()}] Executing createFeedback procedure with aid: ${aid}, description: "${description}"`);

        // Correct the query string with proper parameter names
        const result = await ncbd.query(
            role,
            `EXECUTE createFeedbackCourse @userId = ${aid}, @courseId =${courseId}, @description= N'${description}'`
     
        );

        console.log(`[${new Date().toLocaleString()}] createFeedbackCourse procedure executed successfully.`);
        return result; // Return the result if needed
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] Error executing createFeedbackCourse: ${err.message}`);
        throw new Error(`createFeedbackCourseService.js/tryCreateCourseFeedback | ${err.message}`);
    }
};

module.exports = { tryCreateCourseFeedback };
