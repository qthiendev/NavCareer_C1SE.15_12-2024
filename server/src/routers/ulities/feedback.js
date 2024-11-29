const express = require("express");
const router = express.Router();

const authMiddleware = require('../../middlewares/authentication');
const authzMiddleware = require('../../middlewares/authorization');

const { readFeedback } = require('../../apis/utilities/feedback/SystemFeedback/getFeedback/getFeedbackController');
const { createFeedback } = require('../../apis/utilities/feedback/SystemFeedback/sendFeedback/createFeedbackController');
const { readCourseFeedback } = require('../../apis/utilities/feedback/Coursefeedback//getCourseFeedback/getCourseFeedbackController')
const { createCourseFeedback } = require('../../apis/utilities/feedback/Coursefeedback/sendCourseFeedback/createCourseFeedbackController')


// router.get('/readFeedback',readFeedback);
router.get('/readFeedback',authMiddleware.isSignedIn, authzMiddleware.admin,readFeedback);
router.post('/createFeedback', createFeedback);
router.get('/readCourseFeedback',authMiddleware.isSignedIn, authzMiddleware.esp,readCourseFeedback);
router.post('/createCourseFeedback', createCourseFeedback);

module.exports = router;