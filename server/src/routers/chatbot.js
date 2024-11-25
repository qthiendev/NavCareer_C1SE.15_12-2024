const express = require('express');
const router = express.Router();

const { GetCourseController } = require('../apis/chatbotManagement/chatbotGetCourse/chatbotGetCourseControler');
const { SortPriceOnly} = require('../apis/chatbotManagement/chatbotSortPriceOnly/chatbotSortPriceOnlyController');
const { SortCoursesByFieldAndPrice} = require('../apis/chatbotManagement/chatbotSortPrice/chatbotGetPrizeRangeController');
const { RecommentCourseController } = require('../apis/chatbotManagement/chatbotRecomment/chatbotRecommentControler');
const { GetFieldController } = require('../apis/chatbotManagement/chatbotGetFieldName/chatbotGetFieldControler');


router.post('/GetCourse', GetCourseController);
router.post('/PrizeRange', SortCoursesByFieldAndPrice);
router.post('/PrizeOnly', SortPriceOnly);
router.get('/Recomment', RecommentCourseController);
router.get('/getfield', GetFieldController);


module.exports = router;