const { tryGetManageStudentCoursesReport } = require('./getManageStudentCoursesReportService');

const getManageStudentCoursesReport = async (req, res) => {
    try {
        const { role } = req.session;
        const { user_id } = req.body;
        const now = new Date();
        console.log(`user_id: ${user_id}`);

        // Ensure user_id is provided
        if (!user_id) {
            console.warn(`[${now.toLocaleString()}] Missing user_id in request body.`);
            return res.status(400).json({
                message: 'user_id is required',
                time: now.toLocaleString()
            });
        }

        // Fetch data using the service
        const result = await tryGetManageStudentCoursesReport(role, user_id);

        // Check if no result or empty
        if (!result || result.length === 0) {
            console.warn(`[${now.toLocaleString()}] No data found for user_id: ${user_id}`);
            return res.status(404).json({
                message: 'No courses found for the user.',
                time: now.toLocaleString()
            });
        }

        // If there's a result, send success response
        console.log(`[${now.toLocaleString()}] Data retrieved successfully for user_id: ${user_id}`);
        return res.status(200).json({
            message: 'ManageStudentCoursesReport fetched successfully.',
            data: result,
            time: now.toLocaleString()
        });

    } catch (error) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at getManageStudentCoursesReportController.js/getManageStudentCoursesReport | ${error.message}`);
        return res.status(500).json({
            message: 'Failed to retrieve ManageStudentCoursesReport. Please try again.',
            error: error.message,
            time: now.toLocaleString()
        });
    }
};

module.exports = { getManageStudentCoursesReport };
