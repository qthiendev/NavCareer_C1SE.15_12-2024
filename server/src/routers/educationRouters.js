const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authentication');
const authzMiddleware = require('../middlewares/authorization');

const { enroll } = require('../apis/educationManagement/enrollment/enrollCourse/enrollController');
// const { disenroll } = require('../apis/educationManagement/disenrollCourse/disenrollController');
const { readEnroll } = require('../apis/educationManagement/enrollment/readEnrollment/readEnrollmentController');

const { getCollection, serveMedia, getFrame } = require('../apis/educationManagement/learning/getLearn/getLearnController');

router.post('/enroll', authMiddleware.isSignedIn, enroll);
// router.get('/disenroll', disenroll);
router.get('/read-enroll', authMiddleware.isSignedIn, readEnroll);

router.get('/collection', authMiddleware.isSignedIn, getCollection);
router.get('/frame', authMiddleware.isSignedIn, getFrame);
router.get('/media', authMiddleware.isSignedIn, serveMedia);

module.exports = router;
