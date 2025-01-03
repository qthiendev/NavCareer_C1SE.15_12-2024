const ncbd = require('../../../databases/ncdbService'); // Database connection module

const tryGetManageCoursesReport = async (role, aid) => {
    try {
        console.log(`[${new Date().toLocaleString()}] Executing GetManageCoursesReport query`);
        console.log(`aid: ${aid}`);
        const result = await ncbd.query(
            role, 
            `EXECUTE ManageCoursesReport @user_id=${aid}` // Truyền giá trị cho :aid
        );
        return result; 
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] Query error: ${err.message}`);
        throw new Error(`GetManageCoursesReportService.js/tryGetManageCoursesReport | ${err.message}`);
    }
};
module.exports = { tryGetManageCoursesReport };
