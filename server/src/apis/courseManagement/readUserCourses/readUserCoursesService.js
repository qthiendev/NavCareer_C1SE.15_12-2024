const ncbd = require('../../databases/ncdbService');

const tryReadUserCourses = async (role, aid) => {
    try {
        if (Number.isNaN(aid) || !role)
            throw new Error(`Missing index.`);

        const result = await ncbd.query(role, `execute ReadAllCourse @aid`, { aid });

        return result && result.length > 0 ? result : [];

    } catch (err) {
        throw new Error(`readUserCoursesService.js/tryReadUserCourses| ${err.message}`);
    }
};

module.exports = { tryReadUserCourses };