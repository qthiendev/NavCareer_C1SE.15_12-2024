const { tryGetManageCoursesReport } = require('./getManageCoursesReportService');

const GetManageCoursesReport = async (req, res) => {
    try {
        const now = new Date();
        const { role } = req.session;
        if (!role) {
            console.warn(`[${now.toLocaleString()}] at GetManageCoursesReportController.js/GetManageCoursesReport | Missing role in session.`);
            return res.status(403).json({
                message: 'Access denied. Role not found in session.',
                time: now.toLocaleString()
            });
        }
        const result = await tryGetManageCoursesReport(role);
        if (!result.length) {
            console.warn(`[${now.toLocaleString()}] at GetManageCoursesReportController.js/GetManageCoursesReport | No feedback records found.`);
            return res.status(404).json({
                message: 'No feedback records found.',
                time: now.toLocaleString()
            });
        }
        console.log(`[${now.toLocaleString()}] at GetManageCoursesReportController.js/GetManageCoursesReport | Feedback read successfully.`);
        return res.status(200).json({
            data: result,
            time: now.toLocaleString()
        });
    } catch (error) {
        const now = new Date(); 
        console.error(`[${now.toLocaleString()}] at GetManageCoursesReportController.js/GetManageCoursesReport | ${error.message}`);
        return res.status(500).json({
            message: 'Failed to read Feedback. Please try again.',
            error: error.message,
            time: now.toLocaleString()
        });
    }
};

module.exports = { GetManageCoursesReport };
