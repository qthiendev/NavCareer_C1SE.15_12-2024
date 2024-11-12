const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authentication');
const authzMiddleware = require('../middlewares/authorization');

const { createOrder } = require('../apis/educationManagement/enrollment/payment/paymentController');
const { enroll } = require('../apis/educationManagement/enrollment/enrollCourse/enrollController');
const { readEnroll, readEnrollOf } = require('../apis/educationManagement/enrollment/readEnrollment/readEnrollmentController');
const { getCollection, serveMedia, getFrame } = require('../apis/educationManagement/learning/getLearn/getLearnController');
const { createTracking, readTracking } = require('../apis/educationManagement/learning/tracking/trackingController');
const { createGrade, readGrade } = require('../apis/educationManagement/learning/grading/gradingController');
const { checkAccomplishment, getAccomplishment } = require('../apis/educationManagement/accomplishment/accomplishmentController');

router.post('/payment/create', authMiddleware.isSignedIn, createOrder);

router.post('/enroll', authMiddleware.isSignedIn, enroll);
router.get('/read-enroll', authMiddleware.isSignedIn, readEnroll);
router.get('/read-enroll-of', authMiddleware.isSignedIn, readEnrollOf);

router.get('/collection', authMiddleware.isSignedIn, getCollection);
router.get('/frame', authMiddleware.isSignedIn, getFrame);
router.get('/media', authMiddleware.isSignedIn, serveMedia);

router.post('/create-tracking', authMiddleware.isSignedIn, createTracking);
router.get('/read-tracking', authMiddleware.isSignedIn, readTracking);

router.get('/read-grade', authMiddleware.isSignedIn, readGrade);
router.post('/create-grade', authMiddleware.isSignedIn, createGrade);

router.get('/check-accomplishment', checkAccomplishment);
router.get('/get-accomplishment', getAccomplishment);

module.exports = router;
