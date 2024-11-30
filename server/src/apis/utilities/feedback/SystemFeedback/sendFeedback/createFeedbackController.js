const { tryCreateFeedback } = require('./createFeedbackService');

const createFeedback = async (req, res) => {
    try {
        const now = new Date();
        const { aid, role } = req.session;
        const { description } = req.body;

        // Validate input
        if (!description) {
            console.warn(`[${now.toLocaleString()}] at createFeedbackController.js/createFeedback | Missing description.`);
            return res.status(400).json({
                message: 'Feedback description is required.',
                time: now.toLocaleString()
            });
        }

        // Call the service to execute the stored procedure
        const result = await tryCreateFeedback(role, aid, description);

        console.log(`[${now.toLocaleString()}] at createFeedbackController.js/createFeedback | Feedback created successfully.`);
        return res.status(201).json({
            message: 'Feedback created successfully.',
            result, // Optional: Include the result
            time: now.toLocaleString()
        });
    } catch (error) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at createFeedbackController.js/createFeedback | ${error.message}`);
        return res.status(500).json({
            message: 'Failed to create feedback. Please try again.',
            error: error.message,
            time: now.toLocaleString()
        });
    }
};

module.exports = { createFeedback };
