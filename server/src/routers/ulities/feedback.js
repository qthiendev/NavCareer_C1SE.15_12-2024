const express = require("express");
const router = express.Router();

const { readFeedback } = require('../../apis/utilities/feedback/getFeedback/getFeedbackController');
const { createFeedback } = require('../../apis/utilities/feedback/sendFeedback/createFeedbackController');

router.get('/readFeedback', readFeedback);
router.post('/createFeedback', createFeedback);

module.exports = router;