const express = require("express");
const router = express.Router();

const { GetManageCoursesReport } = require('../../apis/utilities/report/getManageCoursesReport/getManageCoursesReportCotroller');
const { GetUserEnroll } = require('../../apis/utilities/report/getUserEnroll/getUserEnrollCotroller');

router.get('/ManageCoursesReport', GetManageCoursesReport);
router.get('/GetUserEnroll', GetUserEnroll);


module.exports = router;