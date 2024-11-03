const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authentication');
const authzMiddleware = require('../middlewares/authorization');

const { createOrder } = require('../apis/educationManagement/enrollment/payment/paymentController');
const { enroll } = require('../apis/educationManagement/enrollment/enrollCourse/enrollController');
const { readEnroll, readEnrollOf } = require('../apis/educationManagement/enrollment/readEnrollment/readEnrollmentController');
const { getCollection, serveMedia, getFrame } = require('../apis/educationManagement/learning/getLearn/getLearnController');

router.post('/payment/create', authMiddleware.isSignedIn, createOrder);

router.post('/enroll', authMiddleware.isSignedIn, enroll);
router.get('/read-enroll', authMiddleware.isSignedIn, readEnroll);
router.get('/read-enroll-of', authMiddleware.isSignedIn, readEnrollOf);

router.get('/collection', authMiddleware.isSignedIn, getCollection);
router.get('/frame', authMiddleware.isSignedIn, getFrame);
router.get('/media', authMiddleware.isSignedIn, serveMedia);

module.exports = router;
