const express = require('express');
const router = express.Router();

const { GetCourseController } = require('../apis/chatbotManagement/chatbotGetCourse/chatbotGetCourseControler');
const { GetPrizeRange} = require('../apis/chatbotManagement/chatbotSortPrice/range/chatbotGetPrizeRangeController');
const { GetPrizeAbove} = require('../apis/chatbotManagement/chatbotSortPrice/higher/chatbotGetPrizeAboveControler');
const { GetPrizeLower} = require('../apis/chatbotManagement/chatbotSortPrice/lower/chatbotGetPrizeLowerControler');
const { RecommentCourseController } = require('../apis/chatbotManagement/chatbotRecomment/chatbotRecommentControler');


router.get('/GetCourse', GetCourseController);
router.post('/PrizeRange', GetPrizeRange);
router.post('/PrizeAbove', GetPrizeAbove);
router.post('/PrizeLower', GetPrizeLower);
router.get('/Recomment', RecommentCourseController);



module.exports = router;