const fs = require('fs');
const path = require('path');
const { tryReadProfile } = require('./readProfileService');
const now = new Date();

const readProfile = async (req, res) => {
    try {
        const { user_id } = req.query;
        const { role } = req.session;

        if (!role) throw new Error(`'role' is required.`);
        if (!user_id) throw new Error(`'user_id' is required.`);

        const data = await tryReadProfile(role, user_id);

        if (!data) {
            console.log(`[${now.toLocaleString()}] Profile '${user_id}' not found.`);
            return res.status(404).json({
                message: `Profile '${user_id}' not found`,
                time: now.toLocaleString()
            });
        }

        // Construct paths to the images
        const avatarPath = path.join(__dirname, '..', '..', '..','..', 'localResources', data.resource_url, 'avartar.png');
        const coverPath = path.join(__dirname, '..', '..', '..','..', 'localResources', data.resource_url, 'cover.png');

        let avatarBase64 = null;
        let coverBase64 = null;

        // Check if avatar image exists and read it
        if (fs.existsSync(avatarPath)) {
            const avatarImage = fs.readFileSync(avatarPath);
            avatarBase64 = `data:image/png;base64,${avatarImage.toString('base64')}`;
        } else {
            console.warn(`Avatar image not found at: ${avatarPath}`);
            // Optionally, you can set a default image or handle this case accordingly
            avatarBase64 = null; // Or set a default image base64 string
        }

        // Check if cover image exists and read it
        if (fs.existsSync(coverPath)) {
            const coverImage = fs.readFileSync(coverPath);
            coverBase64 = `data:image/png;base64,${coverImage.toString('base64')}`;
        } else {
            console.warn(`Cover image not found at: ${coverPath}`);
            // Optionally, you can set a default image or handle this case accordingly
            coverBase64 = null; // Or set a default image base64 string
        }

        const profileData = {
            ...data,
            avatar: avatarBase64,
            cover: coverBase64,
        };

        console.log(`[${now.toLocaleString()}] Profile data retrieved for '${user_id}'.`);
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
