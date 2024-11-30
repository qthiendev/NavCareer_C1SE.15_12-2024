const ncbd = require('../../../../databases/ncdbService');
const tryReadCourseFeedback = async (role,courseId) => {
    try {
        if (!role)
            throw new Error(`'role' is empty`);

        console.log(`[${new Date().toLocaleString()}] Executing readFeedbackCourse query`);
        console.log(`[${new Date().toLocaleString()}] courseID=${courseId}`);
        const result = await ncbd.query(role, `EXECUTE readFeedbackCourse @courseId`, {courseId});
        return result; 
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] Query error: ${err.message}`);
        throw new Error(`readFeedbackCourseService.js/tryReadCourseFeedback | ${err.message}`);
    }
};

module.exports = { tryReadCourseFeedback };
