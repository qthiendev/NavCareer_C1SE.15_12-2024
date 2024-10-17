const express = require("express");
const router = express.Router();

const { search } = require('../apis/utilities/search/searchController');

router.get('/search', search);

module.exports = router;