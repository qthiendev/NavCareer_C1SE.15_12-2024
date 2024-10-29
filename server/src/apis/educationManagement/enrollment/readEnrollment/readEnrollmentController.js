const { tryReadEnrollment } = require('./readEnrollmentService');

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
                message: `User of aid[${aid}] haven't enrolled any courses yet..`,
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

module.exports = { readEnroll };