const { tryCreateCourseFeedback } = require('./createCourseFeedbackService');

const createCourseFeedback = async (req, res) => {
    try {
        const now = new Date();
        const { aid, role } = req.session;
        const { description, courseId } = req.body;

        // Validate input
        if (!description) {
            console.warn(`[${now.toLocaleString()}] at createCourseFeedbackController.js/CreateCourseFeedback | Missing description.`);
            return res.status(400).json({
                message: 'Feedback description is required.',
                time: now.toLocaleString()
            });
        }

        // Call the service to execute the stored procedure
        const result = await tryCreateCourseFeedback(role, aid, description, courseId);

        console.log(`[${now.toLocaleString()}] at createCourseFeedbackController.js/CreateCourseFeedback | Feedback created successfully.`);
        return res.status(201).json({
            message: 'Feedback created successfully.',
            result, // Optional: Include the result
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
