const { tryUpdateProfile } = require('./updateProfileService');
const now = new Date();

const updateProfile = async (req, res) => {
    try {
        const { aid, role } = req.session;

        // Cập nhật tên biến để khớp với request body
        const {
            user_id: userid,
            user_full_name: userFullName,
            email,
            birthdate,
            gender,
            phone_number: phoneNumber,
            address
        } = req.body;

        // In ra từng phần tử để kiểm tra
        console.log("Các phần tử đã lưu:");
        console.log("userId:", userid);
        console.log("userFullName:", userFullName);
        console.log("email:", email);
        console.log("birthdate:", birthdate);
        console.log("gender:", gender);
        console.log("phoneNumber:", phoneNumber);
        console.log("address:", address);

        // Kiểm tra các trường bắt buộc
        if (!userid || !userFullName || !email || !birthdate || !gender || !phoneNumber || !address) {
            throw new Error('Thiếu các phần tử bắt buộc');
        }

        // Cập nhật profile trong service
        const profileData = { 
            aid,
            role,
            userid,
            userFullName,
            birthdate,
            gender,
            email,
            phoneNumber,
            address: address || 'N/A'
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
