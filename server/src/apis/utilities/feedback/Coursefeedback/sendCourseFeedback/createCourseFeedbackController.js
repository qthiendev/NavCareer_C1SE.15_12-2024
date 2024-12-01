const { tryCreateCourseFeedback } = require('./createCourseFeedbackService');

const createCourseFeedback = async (req, res) => {
    try {
        const now = new Date();
        const { aid, role } = req.session;
        const { description, course_id } = req.body;

        // Validate input
        if (!description) {
            console.warn(`[${now.toLocaleString()}] at createCourseFeedbackController.js/CreateCourseFeedback | Missing description .`);
            return res.status(400).json({
                message: 'Feedback description and course_id are required.',
                time: now.toLocaleString()
            });
        }
        else if(!course_id){
            console.warn(`[${now.toLocaleString()}] at createCourseFeedbackController.js/CreateCourseFeedback | Missing course_id.`);
            return res.status(400).json({
                message: 'Feedback description and course_id are required.',
                time: now.toLocaleString()
            });
        }
        // Gọi service để thực thi thủ tục
        const { result, messages } = await tryCreateCourseFeedback(role, aid, description, course_id);

        console.log(`[${now.toLocaleString()}] at createCourseFeedbackController.js/CreateCourseFeedback | Feedback processed successfully.`);
        return res.status(201).json({
            message: 'Feedback processed successfully.',
            details: messages, // Trả thông báo từ SQL
            result,
            time: now.toLocaleString()
        });
    } catch (error) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at createCourseFeedbackController.js/CreateCourseFeedback | ${error.message}`);
        return res.status(500).json({
            message: 'Failed to create feedback. Please try again.',
            error: error.message,
            time: now.toLocaleString()
        });
    }
};

module.exports = { createCourseFeedback };
