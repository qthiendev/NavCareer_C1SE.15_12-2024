const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authentication');

const { createProfile } = require('../apis/profileManagement/createProfile/createProfileController');
const { readProfile } = require('../apis/profileManagement/readProfile/readProfileController');
const { updateProfile } = require('../apis/profileManagement/updateProfile/updateProfileController');
const { deleteProfile } = require('../apis/profileManagement/deleteProfile/deleteProfileController');


router.post('/create', authMiddleware.isSignedIn, createProfile);
router.get('/read', readProfile);
router.put('/update', authMiddleware.isSignedIn, updateProfile);
router.delete('/delete', authMiddleware.isSignedIn, deleteProfile);

module.exports = router;
