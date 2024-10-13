const { tryDeleteProfile } = require('./deleteProfileService');
const now = new Date();

const deleteProfile = async (req, res) => {
    try {
        const { user_id } = req.query;
        const { role, id: currentUserId } = req.session;

        if (!role)
            throw new Error(`'role' is required.`);

        if (user_id === null || typeof(user_id) === 'undefined')
            throw new Error(`'user_id' is not provided.`); // Sửa lại lỗi thông báo

        if (user_id !== currentUserId.toString()) {
            console.log(`[${now.toLocaleString()}] at deleteProfileController.js/deleteProfile() | Profile '${user_id}' deleted successfully.`);
            return res.status(203).json({
                message: `Failed to delete Profile ${user_id}.`,
                time: now.toLocaleString()
            });
        }
        await tryDeleteProfile(role, user_id); // Đổi tên biến để dễ hiểu hơn

        

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at deleteProfileController.js/deleteProfile() | ${err.message}`);
        res.status(500).json({ 
            message: 'Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { deleteProfile };
