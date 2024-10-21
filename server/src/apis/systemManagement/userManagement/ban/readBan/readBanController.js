const { tryReadBan, tryReadBanESP } = require('./readBanService');
const now = new Date();

const readBan = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const banInfo = await tryReadBan(role);

        if (banInfo) {
            console.log(`[${now.toLocaleString()}] at readBanController.js/readBan | Ban information read successfuly.`);
            return res.status(200).json({
                banInfo,
                time: now.toLocaleString()
            });
        } else {
            console.log(`[${now.toLocaleString()}] at readBanController.js/readBan | Ban information failed to read`);
            return res.status(203).json({
                message: `Ban information failed to read`,
                time: now.toLocaleString()
            });
        }

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at readBanController.js/readBan | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
};

const readBanESP = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const banInfo = await tryReadBanESP(role);

        if (banInfo) {
            console.log(`[${now.toLocaleString()}] at readBanController.js/readBan | Ban information read successfuly.`);
            return res.status(200).json({
                banInfo,
                time: now.toLocaleString()
            });
        } else {
            console.log(`[${now.toLocaleString()}] at readBanController.js/readBan | Ban information failed to read`);
            return res.status(203).json({
                message: `Ban information failed to read`,
                time: now.toLocaleString()
            });
        }

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at readBanController.js/readBan | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { readBan, readBanESP };