const ncbd = require('../../../../databases/ncdbService');

const tryCreateCourseFeedback = async (role, aid, description, courseId) => {
    try {
        console.log(`[${new Date().toLocaleString()}] Executing createFeedbackCourse procedure with aid: ${aid}, description: "${description}"`);

        // Gọi thủ tục qua ncbd.query
        const result = await ncbd.query(
            role,
            `EXECUTE createFeedbackCourse @userId = ${aid}, @courseId = ${courseId}, @description = N'${description}'`
        );

        // Lấy thông báo từ kết quả
        const messages = result && result[0]?.Message ? [result[0].Message] : [];

        console.log(`[${new Date().toLocaleString()}] createFeedbackCourse procedure executed successfully.`);
        return { result, messages }; // Trả về kết quả và thông báo
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] Error executing createFeedbackCourse: ${err.message}`);
        throw new Error(`createFeedbackCourseService.js/tryCreateCourseFeedback | ${err.message}`);
    }
};

module.exports = { tryCreateCourseFeedback };
