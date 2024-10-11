const { tryReadAll } = require('./readAllService');
const now = new Date();

const readAll = async (req, res) => {
    try {
        const { role } = req.session;

        if (!role)
            throw new Error(`'role' is required.`);

        const data = await tryReadAll(role);

        if (data) {
            console.log(`[${now.toLocaleString()}] at readAllController.js/readAll | All user been read.`);
            return res.status(200).json({
                data,
                time: now.toLocaleString()
            });
        } else {
            console.log(`[${now.toLocaleString()}] at readAllController.js/readAll | Cannot get all user`);
            return res.status(203).json({
                message: `Cannot get all user`,
                time: now.toLocaleString()
            });
        }
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at readAllController.js/readAll | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
}

module.exports = { readAll };