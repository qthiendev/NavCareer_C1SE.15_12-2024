const { tryCreateGrade, tryReadGrade } = require('./gradingService');
const now = new Date();

const createGrade = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { eid, m, grade } = req.query;

        if (!eid)
            throw new Error(`'eid' must provided`);

        if (!m)
            throw new Error(`'m' must provided`);

        const data = await tryCreateGrade(aid, role, eid, m, grade);

        if (data === 'BANNED') {
            console.error(`[${new Date().toLocaleString()}] at gradingController.js/createGrade | User of aid[${aid}] not allow to use this procedure.`);
            return res.status(403).json({
                message: `User of aid[${aid}] not allow to use this procedure.`,
                time: new Date().toLocaleString()
            });
        }

        if (data === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at gradingController.js/createGrade | Grade for eid[${eid}], module[${m}], grade[${grade}] created succesfuly.`);
            return res.status(200).json({
                message: `Grade for eid[${eid}], module[${m}], grade[${grade}] created succesfuly.`,
                time: now.toLocaleString()
            });
        }

        if (data === 'FAILED') {
            console.error(`[${now.toLocaleString()}] at gradingController.js/createGrade | Grade for eid[${eid}], module[${m}], grade[${grade}] failed to create.`);
            return res.status(203).json({
                message: `Grade for eid[${eid}], module[${m}], grade[${grade}] failed to create.`,
                time: now.toLocaleString()
            });
        }

        throw new Error('Cannot handle.');

    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at gradingController.js/createGrade | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
}

const readGrade = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { eid, m } = req.query;

        if (!eid)
            throw new Error(`'eid' must provided`);

        if (!m)
            throw new Error(`'m' must provided`);

        const data = await tryReadGrade(aid, role, eid, m);

        if (data.length === 0) {
            console.error(`[${new Date().toLocaleString()}] at gradingController.js/readGrade | Grade for eid[${eid}], module[${m}] not exist.`);
            return res.status(203).json({
                message: `Grade for eid[${eid}], module[${m}] not exist.`,
                time: new Date().toLocaleString()
            });
        }

        if (data[0].check) {
            console.error(`[${new Date().toLocaleString()}] at gradingController.js/readGrade | User of aid[${aid}] not allow to use this procedure.`);
            return res.status(403).json({
                message: `User of aid[${aid}] not allow to use this procedure.`,
                time: new Date().toLocaleString()
            });
        }

        console.log(`[${now.toLocaleString()}] at gradingController.js/readGrade | Grade for eid[${eid}], module[${m}] read succesfuly.`);
        return res.status(200).json({
            grades: data,
            message: `Grade for eid[${eid}], module[${m}] read succesfuly.`,
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at gradingController.js/readGrade | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
}

module.exports = { createGrade, readGrade };