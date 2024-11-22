const { tryGetUserEnroll } = require('./getUserEnrollService');

const GetUserEnroll = async (req, res) => {
    try {
        const now = new Date();
        const { role } = req.session;
        const { course_id } = req.query;
        
        if (!role) {
            console.warn(`[${now.toLocaleString()}] at getUserEnrollController.js/getUserEnroll | Missing role in session.`);
            return res.status(403).json({
                message: 'Access denied. Role not found in session.',
                time: now.toLocaleString()
            });
        }
        const result = await tryGetUserEnroll(role, course_id);
        if (!result.length) {
            console.warn(`[${now.toLocaleString()}] at getUserEnrollController.js/getUserEnroll | No  getUserEnroll records found.`);
            return res.status(404).json({
                message: 'No  getUserEnroll records found.',
                time: now.toLocaleString()
            });
        }
        console.log(`[${now.toLocaleString()}] at getUserEnrollController.js/getUserEnroll |  getUserEnroll read successfully.`);
        return res.status(200).json({
            data: result,
            time: now.toLocaleString()
        });
    } catch (error) {
        const now = new Date(); 
        console.error(`[${now.toLocaleString()}] at getUserEnrollController.js/getUserEnroll | ${error.message}`);
        return res.status(500).json({
            message: 'Failed to read  getUserEnroll. Please try again.',
            error: error.message,
            time: now.toLocaleString()
        });
    }
};

module.exports = { GetUserEnroll };
