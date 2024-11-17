const fs = require('fs');
const path = require('path');
const { trySearch } = require('./searchService');
const now = new Date();

const search = async (req, res) => {
    try {
        const { index } = req.query;
        const { role } = req.session;

        if (!role) throw new Error(`'role' is required.`);
        if (!index) throw new Error(`'index' is required.`);

        const dataList = await trySearch(role, index);

        if (!dataList || dataList.length === 0) {
            console.error(`[${now.toLocaleString()}] at searchContoller.js/search | '${index}' not found.`);
            return res.status(203).json({
                data: dataList,
                message: `'${index}' not found`,
                time: now.toLocaleString()
            });
        }

        console.log(dataList);

        const profiles = [];

        for (let i = 0; i < dataList.length; i++) {
            const data = dataList[i];

            const avatarPath = path.join(__dirname, '..', '..', '..', '..', `localResources\\profiles\\_${data.id}\\avartar.png`);

            let avatarBase64 = null;

            if (fs.existsSync(avatarPath)) {
                const avatarImage = fs.readFileSync(avatarPath);
                avatarBase64 = `data:image/png;base64,${avatarImage.toString('base64')}`;
            } else {
                console.warn(`[${now.toLocaleString()}] at searchContoller.js/search | Avatar image not found at: ${avatarPath}`);
                avatarBase64 = null;
            }

            profiles.push({
                ...data,
                avatar: avatarBase64
            });
        }

        console.log(`[${now.toLocaleString()}] at searchContoller.js/search | Profile data retrieved for index = '${index}'.`);
        return res.status(200).json({ data: profiles, time: now.toLocaleString() });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at searchContoller.js/search | Error in search: ${err.message}`);
        res.status(500).json({
            message: 'Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { search };
