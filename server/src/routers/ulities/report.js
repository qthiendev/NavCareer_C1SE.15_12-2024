const express = require("express");
const router = express.Router();

const { GetManageCoursesReport } = require('../../apis/utilities/report/getManageCoursesReport/getManageCoursesReportCotroller');
const { getManageStudentCoursesReport } = require('../../apis/utilities/report/getManageStudentCoursesReport/getManageStudentCoursesReportController');
const { GetUserEnroll } = require('../../apis/utilities/report/getUserEnroll/getUserEnrollCotroller');

router.get('/ManageCoursesReport', GetManageCoursesReport);
router.get('/ManageStudentCoursesReport', getManageStudentCoursesReport);
router.get('/GetUserEnroll', GetUserEnroll);


module.exports = router;