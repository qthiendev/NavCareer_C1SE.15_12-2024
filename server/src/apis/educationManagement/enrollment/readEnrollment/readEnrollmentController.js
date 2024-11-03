const { tryReadEnrollment, tryReadEnrollmentOf } = require('./readEnrollmentService');

const readEnroll = async (req, res) => {
    try {
        const { aid, role } = req.session;

        const result = await tryReadEnrollment(aid, role);

        if (!result[0].check) {
            console.log(`[${new Date().toLocaleString()}] at readEnrollController.js/readEnroll | Read enrolled courses of user of aid[${aid}] successfully.`);
            return res.status(200).json({
                enrollments: result,
                time: new Date().toLocaleString()
            });
        }

        if (result[0].check === 'U_UID') {
            console.error(`[${new Date().toLocaleString()}] at readEnrollController.js/readEnroll | User profile of aid[${aid}] not found.`);
            return res.status(403).json({
                message: `User profile of aid[${aid}] not found.`,
                time: new Date().toLocaleString()
            });
        }

        if (result[0].check === 'INACTIVE' || result[0].check === 'BANNED') {
            console.error(`[${new Date().toLocaleString()}] at readEnrollController.js/readEnroll | User of aid[${aid}] have no permission.`);
            return res.status(403).json({
                message: `User of aid[${aid}] have no permission.`,
                time: new Date().toLocaleString()
            });
        }

        if (result[0].check === 'U_EID') {
            console.warn(`[${new Date().toLocaleString()}] at readEnrollController.js/readEnroll | User of aid[${aid}] haven't enrolled any courses yet.`);
            return res.status(203).json({
                message: `User of aid[${aid}] haven't enrolled any courses yet.`,
                time: new Date().toLocaleString()
            });
        }

        throw new Error(`Something went wrong, aid:${aid}, role:${role}`);

    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at readEnrollController.js/readEnroll | ${err.message}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
}

const readEnrollOf = async (req, res) => {
    try {
        const { aid, role } = req.session;

        const { course_id } = req.query;

        if (!course_id)
            throw new Error(`'course_id' must provide`);

        const result = await tryReadEnrollmentOf(aid, role, course_id);

        if (!result[0].check) {
            console.log(`[${new Date().toLocaleString()}] at readEnrollController.js/readEnrollOf | Read enrolled course[${course_id}] of user of aid[${aid}] successfully.`);
            return res.status(200).json({
                ...result[0],
                time: new Date().toLocaleString()
            });
        }

        if (result[0].check === 'U_UID') {
            console.error(`[${new Date().toLocaleString()}] at readEnrollController.js/readEnrollOf | User profile of aid[${aid}] not found.`);
            return res.status(403).json({
                message: `User profile of aid[${aid}] not found.`,
                time: new Date().toLocaleString()
            });
        }

        if (result[0].check === 'INACTIVE' || result[0].check === 'BANNED') {
            console.error(`[${new Date().toLocaleString()}] at readEnrollController.js/readEnrollOf | User of aid[${aid}] have no permission.`);
            return res.status(403).json({
                message: `User of aid[${aid}] have no permission.`,
                time: new Date().toLocaleString()
            });
        }

        if (result[0].check === 'U_EID') {
            console.warn(`[${new Date().toLocaleString()}] at readEnrollController.js/readEnrollOf | User of aid[${aid}] haven't enrolled course[${course_id}] yet.`);
            return res.status(403).json({
                message: `User of aid[${aid}] haven't enrolled course[${course_id}].`,
                time: new Date().toLocaleString()
            });
        }

        if (result[0].check === 'U_CID') {
            console.error(`[${new Date().toLocaleString()}] at enrollController.js/readEnrollOf | Course profile of course_id[${course_id}] not found.`);
            return res.status(403).json({
                message: `Course profile of course_id[${course_id}] not found.`,
                time: new Date().toLocaleString()
            });
        }

        throw new Error(`Something went wrong, aid:${aid}, role:${role}`);

    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at readEnrollController.js/readEnrollOf | ${err.message}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
}

module.exports = { readEnroll, readEnrollOf };