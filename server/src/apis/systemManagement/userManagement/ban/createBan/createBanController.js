const { tryCreateBan } = require('./createBanService');
const now = new Date();

const createBan = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { authentication_id, procedure_name } = req.body;
        
        if (authentication_id === undefined || authentication_id === null || procedure_name === undefined || procedure_name === null) {
            throw new Error('Authentication ID and Procedure Name are required.');
        }

        const createBanResult = await tryCreateBan(role, authentication_id, procedure_name);

        if (createBanResult === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at createBanController.js/createBan | Ban information created successfully.`);
            return res.status(200).json({
                message: 'Ban information created successfully.',
                time: now.toLocaleString()
            });
        }

        if (createBanResult === 'U_P_NAME') {
            console.error(`[${now.toLocaleString()}] at createBanController.js/createBan | The specified procedure does not exist.`);
            return res.status(203).json({
                message: 'The specified procedure does not exist.',
                time: now.toLocaleString()
            });
        }

        if (createBanResult === 'U_AID') {
            console.error(`[${now.toLocaleString()}] at createBanController.js/createBan | The specified authentication ID does not exist.`);
            return res.status(203).json({
                message: 'The specified authentication ID does not exist.',
                time: now.toLocaleString()
            });
        }

        if (createBanResult === 'E_BAN') {
            console.warn(`[${now.toLocaleString()}] at createBanController.js/createBan | Ban existed.`);
            return res.status(201).json({
                message: 'Ban existed.',
                time: now.toLocaleString()
            });
        }

        console.log(`[${now.toLocaleString()}] at createBanController.js/createBan | Ban information failed to create.`);
        return res.status(203).json({
            message: 'Ban information failed to create',
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at createBanController.js/createBan | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { createBan };
