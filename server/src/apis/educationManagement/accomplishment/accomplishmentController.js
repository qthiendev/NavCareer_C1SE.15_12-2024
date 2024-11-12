const { tryCheckAccomplishment, tryGetAccomplishment } = require('./accomplishmentService');

const checkAccomplishment = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { enrollment_id } = req.query;

        if (!enrollment_id)
            throw new Error(`'course_id' must be provided`);

        const accomplishmentCheck = await tryCheckAccomplishment(aid, role, enrollment_id);

        if (!accomplishmentCheck)
            throw new Error('Cannot get accomplishment check');

        if (accomplishmentCheck === 'BANNED') {
            console.error(`[${new Date().toLocaleString()}] at accomplishmentController.js/checkAccomplishment | User of aid [${aid}] now allow to access.`);
            return res.status(403).json({
                message: `User of aid [${aid}] now allow to access.`,
                time: new Date().toLocaleString()
            });
        }

        if (accomplishmentCheck === 'E_AID') {
            console.log(`[${new Date().toLocaleString()}] at accomplishmentController.js/checkAccomplishment | Accomplishment of enrollment_id[${enrollment_id}] already created.`);
            return res.status(200).json({
                message: `Accomplishment of enrollment_id[${enrollment_id}] already created.`,
                time: new Date().toLocaleString()
            });

        }

        if (accomplishmentCheck === 'U_AID') {
            console.warn(`[${new Date().toLocaleString()}] at accomplishmentController.js/checkAccomplishment | Enrollment_id[${enrollment_id}] not meet criteria.`);
            return res.status(201).json({
                message: `Enrollment_id[${enrollment_id}] not meet criteria.`,
                time: new Date().toLocaleString()
            });

        }

        if (accomplishmentCheck === 'SUCCESSED') {
            console.log(`[${new Date().toLocaleString()}] at accomplishmentController.js/checkAccomplishment | Accomplishment of enrollment_id[${enrollment_id}] created successfuly.`);
            return res.status(200).json({
                message: `Accomplishment of enrollment_id[${enrollment_id}] created successfuly.`,
                time: new Date().toLocaleString()
            });

        }

        if (accomplishmentCheck === 'FAILED') {
            console.error(`[${new Date().toLocaleString()}] at accomplishmentController.js/checkAccomplishment | Accomplishment of enrollment_id[${enrollment_id}] failed to create.`);
            return res.status(203).json({
                message: `Accomplishment of enrollment_id[${enrollment_id}] failed to create.`,
                time: new Date().toLocaleString()
            });

        }

        throw new Error(`Something went wrong, aid: ${aid}, role: ${role}, enrollment_id: ${enrollment_id}`);

    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at accomplishmentController.js/checkAccomplishment | ${err.message}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
}

const getAccomplishment = async (req, res) => {
    try {
        const { role } = req.session;
        const { enrollment_id, certificate_id } = req.query;

        const isEID = enrollment_id !== null && enrollment_id !== undefined;

        if (!isEID && !certificate_id) {
            throw new Error(`'enrollment_id' or 'certificate_id' must be provided`);
        }

        const data = await tryGetAccomplishment(role, enrollment_id, certificate_id);

        if (!data)
            throw new Error('Cannot get data');

        if (data.length < 1) {
            console.error(`[${new Date().toLocaleString()}] at accomplishmentController.js/getAccomplishment | Accomplishment of eid[${enrollment_id}] or cid[${certificate_id}] not found.`);
            return res.status(203).json({
                message: `Accomplishment of eid[${enrollment_id}] or cid[${certificate_id}] not found.`,
                time: new Date().toLocaleString()
            });
        }

        console.log(`[${new Date().toLocaleString()}] at accomplishmentController.js/getAccomplishment | Accomplishment of eid[${enrollment_id}] or cid[${certificate_id}] found.`);
        return res.status(200).json({
            ...data[0],
            message: `Accomplishment of eid[${enrollment_id}] or cid[${certificate_id}] found.`,
            time: new Date().toLocaleString()
        });

    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at accomplishmentController.js/checkAccomplishment | ${err.message}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
}

module.exports = { checkAccomplishment, getAccomplishment };
