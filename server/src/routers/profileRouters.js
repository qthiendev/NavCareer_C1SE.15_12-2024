const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authentication');

const { createProfile } = require('../apis/profileManagement/createProfile/createProfileController');
const { readProfile } = require('../apis/profileManagement/readProfile/readProfileController');
const { updateProfile } = require('../apis/profileManagement/updateProfile/updateProfileController');
const { deleteProfile } = require('../apis/profileManagement/readProfile/readProfileController');


router.post('/create', authMiddleware.isSignedIn, createProfile);
router.get('/read', readProfile);
router.push('/update', updateProfile);
router.delete('/delete', deleteProfile);

module.exports = router;
