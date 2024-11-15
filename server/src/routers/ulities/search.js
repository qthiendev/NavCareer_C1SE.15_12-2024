const express = require("express");
const router = express.Router();

const { search } = require('../../apis/utilities/search/searchController');
const { predict, saveResponse } = require('../../apis/utilities/career/careerController');

router.get('/search', search);
router.get('/predict', predict);
router.post('/predict-save', saveResponse);

module.exports = router;