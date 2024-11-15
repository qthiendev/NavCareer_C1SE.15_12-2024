const {tryReadFeedback} = require('./readFeedbackService');

const readFeedback = async (req, res) => {
    try {
        const { role } = req.session;
        const result = await tryreadFeedback(role);

        if (result === 'EXISTED') {
            console.warn(`[${now.toLocaleString()}] at readFeedbackController.js/readFeedback | Feedback already existed.`);
            return res.status(201).json({
                message: `Feedback already existed.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at readFeedbackController.js/readFeedback | Feedback readd succesfuly.`);
            req.session.destroy((err) => {
                if (err)
                    throw new Error(err);

                console.log(`[${new Date().toLocaleString()}] at signOutController.js/signOut | Signed out successfully`);
            });
            return res.status(200).json({
                message: `Feedback readd succesfuly.`,
                time: now.toLocaleString()
            });
        }
    } catch (error) {
        console.error(`[${now.toLocaleString()}] at readFeedbackController.js/readFeedback | ${err.message}`);
        res.status(500).json({
            message: 'Failed to read Feedback. Please try again.',
            read_status: false
        });
    }
}

module.exports = { readFeedback };