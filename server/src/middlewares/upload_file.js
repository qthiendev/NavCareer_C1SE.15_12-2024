const multer = require('multer');
const path = require('path');
var appRoot = require('app-root-path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot+"/localResources/profiles/_1");
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        const id = req.session.aid; 
        // cb(null, file.fieldname + '_' + {aid});
        cb(null, 'avatar.png');
    }
});

const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

module.exports = {
    upload, storage, imageFilter,
}