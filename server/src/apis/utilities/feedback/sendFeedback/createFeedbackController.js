const {tryCreateFeedback} = require('./createFeedbackService');

const createFeedback = async (req, res) => {
    try {
        const { aid } = req.session;
        const { feedback_decrition } = req.body;
        const result = await tryCreateFeedback(aid, feedback_decrition);

        if (result === 'EXISTED') {
            console.warn(`[${now.toLocaleString()}] at createFeedbackController.js/createFeedback | Feedback already existed.`);
            return res.status(201).json({
                message: `Feedback already existed.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at createFeedbackController.js/createFeedback | Feedback created succesfuly.`);
            req.session.destroy((err) => {
                if (err)
                    throw new Error(err);

                console.log(`[${new Date().toLocaleString()}] at signOutController.js/signOut | Signed out successfully`);
            });
            return res.status(200).json({
                message: `Feedback created succesfuly.`,
                time: now.toLocaleString()
            });
        }
    } catch (error) {
        console.error(`[${now.toLocaleString()}] at createFeedbackController.js/createFeedback | ${err.message}`);
        res.status(500).json({
            message: 'Failed to create Feedback. Please try again.',
            create_status: false
        });
    }
}

module.exports = { createFeedback };