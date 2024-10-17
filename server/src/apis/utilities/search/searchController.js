const fs = require('fs');
const path = require('path');
const { trySearch } = require('./searchService'); // Adjust the import based on your file structure
const now = new Date();

const search = async (req, res) => {
    try {
        const { index } = req.query;
        const { role } = req.session;

        if (!role) throw new Error(`'role' is required.`);
        if (!index) throw new Error(`'index' is required.`);

        const dataList = await trySearch(role, index);

        if (!dataList || dataList.length === 0) {
            console.log(`[${now.toLocaleString()}] '${index}' not found.`);
            return res.status(203).json({
                data: dataList,
                message: `'${index}' not found`,
                time: now.toLocaleString()
            });
        }

        // Prepare an array to hold profile data
        const profiles = [];

        for (let i = 0; i < dataList.length; i++) {
            const data = dataList[i];

            // Check if resource is defined
            if (!data.resource) {
                console.warn(`[${now.toLocaleString()}] Missing resource for profile: ${JSON.stringify(data)}`);
                // Set a default or null avatar if resource is missing
                profiles.push({
                    ...data,
                    avatar: null // Keep the record but set avatar to null
                });
                continue; // Skip to the next iteration
            }

            // Construct path to the avatar image
            const avatarPath = path.join(__dirname, '..', '..', '..', '..', 'localResources', data.resource, 'avartar.png');

            let avatarBase64 = null;

            // Check if avatar image exists and read it
            if (fs.existsSync(avatarPath)) {
                const avatarImage = fs.readFileSync(avatarPath);
                avatarBase64 = `data:image/png;base64,${avatarImage.toString('base64')}`;
            } else {
                console.warn(`Avatar image not found at: ${avatarPath}`);
                avatarBase64 = null; // Set avatarBase64 to null if not found
            }

            // Push profile data into the profiles array, ensuring avatar is always set
            profiles.push({
                ...data,
                avatar: avatarBase64 // This will be null if the image isn't found
            });
        }

        console.log(`[${now.toLocaleString()}] Profile data retrieved for '${index}'.`);
        return res.status(200).json({ data: profiles, time: now.toLocaleString() });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] Error in search: ${err.message}`);
        res.status(500).json({
            message: 'Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { search };
