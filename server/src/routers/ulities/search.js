const express = require("express");
const router = express.Router();

const { search } = require('../../apis/utilities/search/searchController');
const { predict, saveResponse, getAvailableCareer } = require('../../apis/utilities/career/careerController');
const { chat } = require('../../apis/utilities/chatbot/chatbotController')

router.get('/search', search);
router.get('/predict', predict);
router.get('/available-career', getAvailableCareer);
router.post('/predict-save', saveResponse);
router.post('/chat', chat);

module.exports = router;