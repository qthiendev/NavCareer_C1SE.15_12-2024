const { tryEnroll } = require('./enrollService');
const { tryCheckOrder } = require('../payment/paymentService');

const enroll = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { course_id, apptransid } = req.query;

        console.log(req.query);

        if (!course_id)
            throw new Error(`'course_id' must be provided`);

        if (!apptransid)
            throw new Error(`'apptransid' must be provided`);

        const paymentCheck = await tryCheckOrder(aid, role, apptransid);

        if (!paymentCheck)
            throw new Error('Cannot get payment check');

        if (paymentCheck.returncode !== 1) {
            console.error(`[${new Date().toLocaleString()}] at enrollController.js/enroll | ${paymentCheck.returnmessage}.`);
            return res.status(203).json({
                message: paymentCheck.returnmessage,
                time: new Date().toLocaleString()
            });
        } else {
            if (paymentCheck.status) {
                console.error(`[${new Date().toLocaleString()}] at enrollController.js/enroll | Payment[${apptransid}] already used.`);
                return res.status(203).json({
                    message: `Payment[${apptransid}] already used.`,
                    time: new Date().toLocaleString()
                });
            }
        }

        console.log(`[${new Date().toLocaleString()}] at enrollController.js/enroll | ${paymentCheck.returnmessage}.`);

        const result = await tryEnroll(aid, role, Number.parseInt(course_id), apptransid);

        if (!result)
            throw new Error('Cannot get payment result');

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
            console.error(`[${new Date().toLocaleString()}] at enrollController.js/enroll | User of aid[${aid}] has no permission.`);
            return res.status(403).json({
                message: `User of aid[${aid}] has no permission.`,
                time: new Date().toLocaleString()
            });
        }

        if (result === 'E_EID') {
            console.warn(`[${new Date().toLocaleString()}] at enrollController.js/enroll | User of aid[${aid}] already enrolled in course[${course_id}].`);
            return res.status(201).json({
                message: `User of aid[${aid}] already enrolled in course[${course_id}].`,
                time: new Date().toLocaleString()
            });
        }

        if (result === 'FAILED') {
            console.error(`[${new Date().toLocaleString()}] at enrollController.js/enroll | User of aid[${aid}] failed to enroll in course[${course_id}].`);
            return res.status(203).json({
                message: `User of aid[${aid}] failed to enroll in course[${course_id}].`,
                time: new Date().toLocaleString()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${new Date().toLocaleString()}] at enrollController.js/enroll | User of aid[${aid}] successfully enrolled in course[${course_id}].`);
            return res.status(200).json({
                message: `User of aid[${aid}] successfully enrolled in course[${course_id}].`,
                time: new Date().toLocaleString()
            });
        }

        throw new Error(`Something went wrong, aid: ${aid}, role: ${role}, course_id: ${course_id}`);

    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at enrollController.js/enroll | ${err.message}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
}

module.exports = { enroll };
