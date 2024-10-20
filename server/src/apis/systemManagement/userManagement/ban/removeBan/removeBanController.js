const { tryRemoveBan } = require('./removeBanService');
const now = new Date();

const removeBan = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { authentication_id, procedure_name } = req.body;

        if (authentication_id === undefined || authentication_id === null || procedure_name === undefined || procedure_name === null) {
            throw new Error('Authentication ID and Procedure Name are required.');
        }

        const removeBanResult = await tryRemoveBan(role, authentication_id, procedure_name);

        if (removeBanResult === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at removeBanController.js/removeBan | Ban information removed successfully.`);
            return res.status(200).json({
                message: 'Ban information removed successfully.',
                time: now.toLocaleString()
            });
        }

        console.log(`[${now.toLocaleString()}] at removeBanController.js/removeBan | Ban information failed to remove.`);
        return res.status(203).json({
            message: removeBanResult[0]?.message || 'Ban information failed to remove',
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at removeBanController.js/removeBan | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { removeBan };
