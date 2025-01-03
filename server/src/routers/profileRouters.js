const express = require('express');
const router = express.Router();
const { upload }= require('../middlewares/upload_file');

const authMiddleware = require('../middlewares/authentication');

const { createProfile } = require('../apis/profileManagement/createProfile/createProfileController');
const { readProfile } = require('../apis/profileManagement/readProfile/readProfileController');
const { updateProfile } = require('../apis/profileManagement/updateProfile/updateProfileController');


router.post('/create', authMiddleware.isSignedIn, createProfile);
router.get('/read', readProfile);
router.put('/update', authMiddleware.isSignedIn,upload.single('avatar') ,updateProfile);

module.exports = router;
