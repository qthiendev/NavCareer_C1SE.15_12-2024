const ncbd = require('../../../databases/ncdbService'); // Database connection module

const tryGetManageCoursesReport = async (role) => {
    try {
        console.log(`[${new Date().toLocaleString()}] Executing GetManageCoursesReport query`);
        const result = await ncbd.query(role, `EXECUTE ManageCoursesReport`);
        return result; 
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] Query error: ${err.message}`);
        throw new Error(`GetManageCoursesReportService.js/tryGetManageCoursesReport | ${err.message}`);
    }
};

module.exports = { tryGetManageCoursesReport };
