const ncbd = require('../../../databases/ncdbService'); // Database connection module

const tryGetUserEnroll = async (role, course_id) => {
    try {
        console.log(`[${new Date().toLocaleString()}] Executing GetManageCoursesReport query`);
        const result = await ncbd.query(
            role, 
            `EXECUTE GetUsersEnrolledInCourse @Course_id=${course_id}` // Truyền giá trị cho :aid
        );
        return result; 
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] Query error: ${err.message}`);
        throw new Error(`tryGetUserEnrollService.js/tryGetUserEnroll | ${err.message}`);
    }
};
module.exports = { tryGetUserEnroll };
