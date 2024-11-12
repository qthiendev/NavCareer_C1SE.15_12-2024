const { tryCheckAccomplishment } = require('./accomplishmentService');

const accomplishment = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { enrollment_id } = req.query;

        if (!enrollment_id)
            throw new Error(`'course_id' must be provided`);

        const accomplishmentCheck = await tryCheckAccomplishment(aid, role, enrollment_id);

        if (!accomplishmentCheck)
            throw new Error('Cannot get accomplishment check');

        if (accomplishmentCheck === 'BANNED') {
            console.error(`[${new Date().toLocaleString()}] at accomplishmentController.js/accomplishment | User of aid [${aid}] now allow to access.`);
            return res.status(403).json({
                message: `User of aid [${aid}] now allow to access.`,
                time: new Date().toLocaleString()
            });
        } 

        if (accomplishmentCheck === 'E_AID') {
            if (paymentCheck.status) {
                console.error(`[${new Date().toLocaleString()}] at accomplishmentController.js/accomplishment | Accomplishment of enrollment_id[${enrollment_id}] already created.`);
                return res.status(201).json({
                    message: `Accomplishment of enrollment_id[${enrollment_id}] already created.`,
                    time: new Date().toLocaleString()
                });
            }
        }

        throw new Error(`Something went wrong, aid: ${aid}, role: ${role}, enrollment_id: ${enrollment_id}`);

    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at accomplishmentController.js/accomplishment | ${err.message}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
}

module.exports = { accomplishment };
