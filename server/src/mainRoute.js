const express = require('express');
const router = express.Router();

const { queryDB } = require('./apis/database/queryDBService');

const { signIn } = require('./apis/authentications/signIn/signInController'); // Done
const { signUp } = require('./apis/authentications/signUp/signUpController'); // On going
const { resetPassword } = require('./apis/authentications/resetPassword/resetPasswordController');
const { deleteAccount } = require('./apis/authentications/deleteAccount/deleteAccountController');

const { createProfile } = require('./apis/profileManagement/createProfile/createProfileController');
const { readProfile } = require('./apis/profileManagement/readProfile/readProfileController'); // Done
const { updateProfile } = require('./apis/profileManagement/updateProfile/updateProfileController');

const { createCourse } = require('./apis/CourseManagement/createCourse/createCourseController');
const { readCourse } = require('./apis/CourseManagement/readCourse/readCourseController');
const { updateCourse } = require('./apis/CourseManagement/updateCourse/updateCourseController');
const { deleteCourse } = require('./apis/CourseManagement/deleteCourse/deleteCourseController');


const { enroll } = require('./apis/educationManagement/enrollCourse/enrollController');
const { disenroll } = require('./apis/educationManagement/disenrollCourse/disenrollController');

//test router
router.get('/test/serverstatus', (req, res) => { res.json(`Hi, I'm handsome dev @decseize, I wonder wot you doing here.`); });
router.get('/test/query', async (req, res) => {
    const { queryString } = req.query;
    data = await queryDB('sa', queryString, {});
    res.json(data);
});

// main router
router.get('/', (req, res) => { });

router.get('/authentication/signin', signIn);
router.get('/authentication/signup', signUp);
router.get('/authentication/reset', resetPassword);
router.get('/authentication/delete', deleteAccount);

router.get('/profile/create', createProfile);
router.get('/profile/read', readProfile);
router.get('/profile/update', updateProfile);

router.get('/course/create', createCourse);
router.get('/course/read', readCourse);
router.get('/course/update', updateCourse);
router.get('/course/delete', deleteCourse);

router.get('/education/enroll', enroll);
router.get('/education/disenroll', disenroll);

module.exports = router;