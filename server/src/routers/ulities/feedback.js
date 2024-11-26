const express = require("express");
const router = express.Router();

const authMiddleware = require('../../middlewares/authentication');
const authzMiddleware = require('../../middlewares/authorization');

const { readFeedback } = require('../../apis/utilities/feedback/getFeedback/getFeedbackController');
const { createFeedback } = require('../../apis/utilities/feedback/sendFeedback/createFeedbackController');

// router.get('/readFeedback',readFeedback);
router.get('/readFeedback',authMiddleware.isSignedIn, authzMiddleware.admin,readFeedback);
router.post('/createFeedback', createFeedback);

module.exports = router;