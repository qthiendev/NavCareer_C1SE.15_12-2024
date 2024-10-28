const { tryEnroll } = require('./enrollService');

const enroll = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { course_id } = req.query;

        if (!course_id)
            throw new Error(`'course_id' must provided`);

        const result = await tryEnroll(aid, role, Number.parseInt(course_id));

        if (result === 'U_UID') {
            console.error(`[${new Date().toLocaleString()}] at enrollController.js/enroll | User profile of aid[${aid}] not found.`);
            return res.status(403).json({
                message: `User profile of aid[${aid}] not found.`,
                time: new Date().toLocaleString()
            });
        }

        if (result === 'U_CID') {
            console.error(`[${new Date().toLocaleString()}] at enrollController.js/enroll | Course profile of course_id[${course_id}] not found.`);
            return res.status(403).json({
                message: `Course profile of course_id[${course_id}] not found.`,
                time: new Date().toLocaleString()
            });
        }

        if (result === 'INACTIVE' || result === 'BANNED') {
            console.error(`[${new Date().toLocaleString()}] at enrollController.js/enroll | User of aid[${aid}] have no permission.`);
            return res.status(403).json({
                message: `User of aid[${aid}] have no permission.`,
                time: new Date().toLocaleString()
            });
        }

        if (result === 'E_EID') {
            console.warn(`[${new Date().toLocaleString()}] at enrollController.js/enroll | User of aid[${aid}] already enrolled course[${course_id}].`);
            return res.status(201).json({
                message: `User of aid[${aid}] already enrolled course[${course_id}].`,
                time: new Date().toLocaleString()
            });
        }

        if (result === 'FAILED') {
            console.error(`[${new Date().toLocaleString()}] at enrollController.js/enroll | User of aid[${aid}] failed to enroll course[${course_id}].`);
            return res.status(203).json({
                message: `User of aid[${aid}] failed to enroll course[${course_id}].`,
                time: new Date().toLocaleString()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${new Date().toLocaleString()}] at enrollController.js/enroll | User of aid[${aid}] enrolled successfuly course[${course_id}].`);
            return res.status(200).json({
                message: `User of aid[${aid}] enrolled successfuly course[${course_id}].`,
                time: new Date().toLocaleString()
            });
        }

        throw new Error(`Something went wrong, aid:${aid}, role:${role}, course_id:${course_id}`);

    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at enrollController.js/enroll | ${err.message}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
}

module.exports = { enroll };