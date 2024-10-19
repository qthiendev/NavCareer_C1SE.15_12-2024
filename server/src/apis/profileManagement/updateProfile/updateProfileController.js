const { tryUpdateProfile } = require('./updateProfileService');
const now = new Date();

const updateProfile = async (req, res) => {
    try {
        const { aid, role } = req.session;

        // Cập nhật tên biến để khớp với request body
        const {
            user_id,
            user_full_name,
            email,
            birthdate,
            gender,
            phone_number,
            address,
            is_active
        } = req.body;

        console.log(req.body)

        // In ra từng phần tử để kiểm tra
        // console.log("Các phần tử đã lưu:");
        // console.log("userId:", user_id);
        // console.log("userFullName:", user_full_name);
        // console.log("email:", email);
        // console.log("birthdate:", birthdate);
        // console.log("gender:", gender);
        // console.log("phoneNumber:", phone_number);
        // console.log("address:", address);

        // Kiểm tra các trường bắt buộc
        if (Number.isNaN(user_id) || !user_full_name || !email || !birthdate || gender === null || !phone_number || !address) {
            throw new Error('Thiếu các phần tử bắt buộc');
        }

        // Cập nhật profile trong service
        const profileData = { 
            aid,
            role,
            user_id,
            user_full_name,
            email,
            birthdate,
            gender,
            phone_number,
            address,
            is_active
        };

        const updatedProfile = await tryUpdateProfile(profileData);
        if (updatedProfile) {
            console.log(`[${now.toLocaleString()}] tại updateProfileController.js/updateProfile() | Cập nhật hồ sơ thành công!`);
            return res.status(200).json({
                message: 'Cập nhật hồ sơ thành công!',
                update_status: true
            });
        } else {
            console.error(`[${now.toLocaleString()}] tại updateProfileController.js/updateProfile() | Cập nhật hồ sơ thất bại!`);
            return res.status(203).json({
                message: 'Cập nhật hồ sơ thất bại!',
                update_status: false
            });
        }
    } catch (err) {
        console.error(`[${now.toLocaleString()}] tại updateProfileController.js/updateProfile() | ${err.message}`);
        res.status(500).json({
            message: 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.',
            update_status: false
        });
    }
};

module.exports = { updateProfile };
