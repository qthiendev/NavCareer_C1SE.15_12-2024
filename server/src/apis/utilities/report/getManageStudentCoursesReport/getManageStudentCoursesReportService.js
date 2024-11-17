const ncbd = require('../../../databases/ncdbService');  // Your database service

const tryGetManageStudentCoursesReport = async (role,user_id) => {
    try {
        console.log(`[${new Date().toLocaleString()}] Executing ManageStudentCoursesReport for user_id: ${user_id}`);

        // Execute the stored procedure using the query function from ncbdService
        const result = await ncbd.query(
            role,  // Replace with the actual role if dynamic
            `EXEC ManageStudentCoursesReport @user_id `,
            { user_id }  // Passing user_id as a parameter
        );

        console.log(`[${new Date().toLocaleString()}] ManageStudentCoursesReport procedure executed successfully.`);
        return result;
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] Error executing procedure: ${err.message}`);
        throw new Error(`GetManageStudentCoursesReportService.js/tryGetManageStudentCoursesReport | ${err.message}`);
    }
};

module.exports = { tryGetManageStudentCoursesReport };
