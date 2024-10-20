const { tryCheckBan } = require('./checkBanService');
const now = new Date();

const checkBan = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { procedure_name } = req.query;
        const banInfo = await tryCheckBan(aid, role, procedure_name);

        if (banInfo === 'BANNED') {
            console.log(`[${now.toLocaleString()}] at checkBanController.js/checkBan | User've been banned.`);
            return res.status(403).json({
                message: `User've been banned.`,
                time: now.toLocaleString()
            });
        } else {
            console.log(`[${now.toLocaleString()}] at checkBanController.js/checkBan | User've not been banned.`);
            return res.status(200).json({
                message: `User've not been banned.`,
                time: now.toLocaleString()
            });
        }

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at checkBanController.js/checkBan | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { checkBan };