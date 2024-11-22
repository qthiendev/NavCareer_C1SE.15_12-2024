const { tryGetManageCoursesReport } = require('./getManageCoursesReportService');

const GetManageCoursesReport = async (req, res) => {
    try {
        const now = new Date();
        const { role, aid } = req.session;
        console.log(`aid: ${aid}`);
        
        if (!role) {
            console.warn(`[${now.toLocaleString()}] at GetManageCoursesReportController.js/GetManageCoursesReport | Missing role in session.`);
            return res.status(403).json({
                message: 'Access denied. Role not found in session.',
                time: now.toLocaleString()
            });
        }
        const result = await tryGetManageCoursesReport(role, aid);
        if (!result.length) {
            console.warn(`[${now.toLocaleString()}] at GetManageCoursesReportController.js/GetManageCoursesReport | No  GetManageCoursesReport records found.`);
            return res.status(404).json({
                message: 'No  GetManageCoursesReport records found.',
                time: now.toLocaleString()
            });
        }
        console.log(`[${now.toLocaleString()}] at GetManageCoursesReportController.js/GetManageCoursesReport |  GetManageCoursesReport read successfully.`);
        return res.status(200).json({
            data: result,
            time: now.toLocaleString()
        });
    } catch (error) {
        const now = new Date(); 
        console.error(`[${now.toLocaleString()}] at GetManageCoursesReportController.js/GetManageCoursesReport | ${error.message}`);
        return res.status(500).json({
            message: 'Failed to read  GetManageCoursesReport. Please try again.',
            error: error.message,
            time: now.toLocaleString()
        });
    }
};

module.exports = { GetManageCoursesReport };
