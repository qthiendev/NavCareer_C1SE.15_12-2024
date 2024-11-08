const multer = require('multer');
const path = require('path');
const fs = require('fs');
var appRoot = require('app-root-path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userFolder = appRoot + "/localResources/profiles/_" + req.session.aid + "/";
        
        // Kiểm tra xem thư mục của người dùng đã tồn tại chưa, nếu chưa thì tạo mới
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        cb(null, userFolder);
    },

    filename: function (req, file, cb) {
        const avatarPath = appRoot + "/localResources/profiles/_" + req.session.aid + "/avatar.png";

        // Kiểm tra nếu file avatar.png đã tồn tại, xóa file cũ
        if (fs.existsSync(avatarPath)) {
            fs.unlinkSync(avatarPath);
        }

        cb(null, 'avartar.png'); // Tên file cố định là avatar.png
    }
});

const imageFilter = function (req, file, cb) {
    // Chỉ chấp nhận các file hình ảnh
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Chỉ chấp nhận file hình ảnh!';
        return cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

module.exports = {
    upload,
    storage,
    imageFilter,
};
