const fs = require('fs');
const path = require('path');
const { tryReadProfile, tryReadProfileSignedIn } = require('./readProfileService');
const now = new Date();

const readProfile = async (req, res) => {
    try {
        const { user_id, auth_id } = req.query;
        const { aid, role } = req.session;

        if (!role) throw new Error(`'role' is required.`);

        let data;
        if (typeof aid === 'number' && !Number.isNaN(aid)) {
            data = await tryReadProfileSignedIn(role, aid, user_id, auth_id);
        } else {
            data = await tryReadProfile(role, user_id, auth_id);
        }

        if (!data) {
            console.log(`[${now.toLocaleString()}] Profile '${user_id}', '${auth_id}' not found.`);
            return res.status(203).json({
                message: `Profile '${user_id}', '${auth_id}' not found`,
                time: now.toLocaleString()
            });
        }

        const avatarPath = path.join(__dirname, '..', '..', '..', '..', 'localResources', data.user_resource_url, 'avartar.png');

        let avatarBase64 = null;

        if (fs.existsSync(avatarPath)) {
            const avatarImage = fs.readFileSync(avatarPath);
            avatarBase64 = `data:image/png;base64,${avatarImage.toString('base64')}`;
        } else {
            console.warn(`Avatar image not found at: ${avatarPath}`);
            avatarBase64 = null;
        }

        const profileData = {
            ...data,
            avatar: avatarBase64,
        };

        console.log(`[${now.toLocaleString()}] Profile data retrieved for '${user_id}', '${auth_id}'.`);
        return res.status(200).json({ ...profileData, time: now.toLocaleString() });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] readProfileContoller.js/readProfile | ${err.message}`);
        res.status(500).json({
            message: 'Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { readProfile };
