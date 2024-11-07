const { tryCreateTracking, tryReadTracking } = require('./trackingService');
const now = new Date();

const createTracking = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { eid, cid } = req.query;

        if (!eid)
            throw new Error(`'eid' must provided`);

        if (!cid)
            throw new Error(`'cid' must provided`);

        const data = await tryCreateTracking(aid, role, eid, cid);

        if (!data)
            throw new Error('Cannot get data');

        if (data === 'BANNED') {
            console.error(`[${new Date().toLocaleString()}] at trackingController.js/createTracking | User of aid[${aid}] not allow to use this procedure.`);
            return res.status(403).json({
                message: `User of aid[${aid}] not allow to use this procedure.`,
                time: new Date().toLocaleString()
            });
        }

        if (data === 'U_EID') {
            console.error(`[${new Date().toLocaleString()}] at trackingController.js/createTracking | Enrollment[${eid}] not found.`);
            return res.status(403).json({
                message: `Enrollment[${eid}] not found.`,
                time: new Date().toLocaleString()
            });
        }

        if (data === 'E_TID') {
            console.warn(`[${new Date().toLocaleString()}] at trackingController.js/createTracking | Tracking for eid[${eid}] and cid[${cid}] existed.`);
            return res.status(201).json({
                message: `Tracking for eid[${eid}] and cid[${cid}] existed.`,
                time: new Date().toLocaleString()
            });
        }

        if (data === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at trackingController.js/createTracking | Tracking for eid[${eid}] and cid[${cid}] created succesfuly.`);
            return res.status(200).json({
                message: `Tracking for eid[${eid}] and cid[${cid}] created succesfuly.`,
                time: now.toLocaleString()
            });
        }

        if (data === 'FAILED') {
            console.log(`[${now.toLocaleString()}] at trackingController.js/createTracking | Tracking for eid[${eid}] and cid[${cid}] failed to create.`);
            return res.status(203).json({
                message: `Tracking for eid[${eid}] and cid[${cid}] failed to create.`,
                time: now.toLocaleString()
            });
        }

        throw new Error('Cannot handle.');

    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at trackingController.js/createTracking | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
}

const readTracking = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { eid } = req.query;

        if (!eid)
            throw new Error(`'eid' must provided`);

        const data = await tryReadTracking(aid, role, eid);

        if (!data)
            throw new Error('Cannot handle.');

        console.log(`[${now.toLocaleString()}] at trackingController.js/readTracking | Tracking for eid[${eid}] read succesfuly.`);
        return res.status(200).json({
            ...data,
            message: `Tracking for eid[${eid}] read succesfuly.`,
            time: now.toLocaleString()
        });

    } catch (err) {

    }
}

module.exports = { createTracking, readTracking };