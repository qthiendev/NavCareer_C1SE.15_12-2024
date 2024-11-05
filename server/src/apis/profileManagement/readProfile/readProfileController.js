const fs = require('fs');
const path = require('path');
const { tryReadProfile } = require('./readProfileService');
const { query } = require('express');
const now = new Date();

const readProfile = async (req, res) => {
    try {
        const { user_id } = req.query;
        const { aid, role, uid } = req.session;

        if (!role) throw new Error(`'role' is required.`);

        if (!user_id) throw new Error(`'user_id' is required.`);

        const data = await tryReadProfile(aid, role, user_id === 'self' ? uid : Number.parseInt(user_id));
        
        if (!data) {
            console.log(`[${now.toLocaleString()}] Profile '${user_id}'`);
            return res.status(203).json({
                message: `Profile '${user_id}' not found`,
                time: now.toLocaleString()
            });
        }

        const avatarPath = path.join(__dirname, '..', '..', '..', '..', `localResources\\profiles\\_${data.user_id}\\avartar.png`);

        let avatarBase64 = null;

        if (fs.existsSync(avatarPath)) {
            const avatarImage = fs.readFileSync(avatarPath);
            avatarBase64 = `data:image/png;base64,${avatarImage.toString('base64')}`;
            console.log('\x1b[32m%s\x1b[0m', `[${now.toLocaleString()}] at readProfileContoller.js/readProfile | Avatar image found at: ${avatarPath}`);
        } else {
            console.warn(`[${now.toLocaleString()}] at readProfileContoller.js/readProfile | Avatar image not found at: ${avatarPath}`);
            avatarBase64 = null;
        }

        const profileData = {
            ...data,
            avatar: avatarBase64,
        };

        console.log(`[${now.toLocaleString()}] at readProfileContoller.js/readProfile | Profile data retrieved for '${user_id}'.`);
        return res.status(200).json({ ...profileData, time: now.toLocaleString() });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at readProfileContoller.js/readProfile | ${err.message}`);
        res.status(500).json({
            message: 'Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { readProfile };
