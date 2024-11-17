const express = require("express");
const router = express.Router();

const { search } = require('../../apis/utilities/search/searchController');
const { predict, saveResponse, getAvailableCareer } = require('../../apis/utilities/career/careerController');

router.get('/search', search);
router.get('/predict', predict);
router.get('/available-career', getAvailableCareer);
router.post('/predict-save', saveResponse);

module.exports = router;