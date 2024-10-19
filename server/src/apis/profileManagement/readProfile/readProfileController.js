const fs = require('fs');
const path = require('path');
const { tryReadProfile, tryReadProfileSignedIn } = require('./readProfileService');
const now = new Date();

const readProfile = async (req, res) => {
    try {
        const { auth_id } = req.query;
        const { aid, role } = req.session;

        if (!role) throw new Error(`'role' is required.`);
        if (!auth_id) throw new Error(`'auth_id' is required.`);

        // Check if aid exists and is a number
        let data;
        if (typeof aid === 'number' && !Number.isNaN(aid)) {
            data = await tryReadProfileSignedIn(role, aid, auth_id);
        } else {
            data = await tryReadProfile(role, auth_id);
        }

        if (!data) {
            console.log(`[${now.toLocaleString()}] Profile '${auth_id}' not found.`);
            return res.status(203).json({
                message: `Profile '${auth_id}' not found`,
                time: now.toLocaleString()
            });
        }

        // Construct paths to the images
        const avatarPath = path.join(__dirname, '..', '..', '..', '..', 'localResources', data.resource_url, 'avartar.png');

        let avatarBase64 = null;

        // Check if avatar image exists and read it
        if (fs.existsSync(avatarPath)) {
            const avatarImage = fs.readFileSync(avatarPath);
            avatarBase64 = `data:image/png;base64,${avatarImage.toString('base64')}`;
        } else {
            console.warn(`Avatar image not found at: ${avatarPath}`);
            // Optionally, you can set a default image or handle this case accordingly
            avatarBase64 = null; // Or set a default image base64 string
        }
        const profileData = {
            ...data,
            avatar: avatarBase64,
        };

        console.log(`[${now.toLocaleString()}] Profile data retrieved for '${auth_id}'.`);
        return res.status(200).json({ data: profileData, time: now.toLocaleString() });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] Error in readProfile: ${err.message}`);
        res.status(500).json({
            message: 'Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { readProfile };
