const express = require("express");
const router = express.Router();

const { GetManageCoursesReport } = require('../../apis/utilities/report/getManageCoursesReport/getManageCoursesReportCotroller');
const { getManageStudentCoursesReport } = require('../../apis/utilities/report/getManageStudentCoursesReport/getManageStudentCoursesReportController');

router.get('/ManageCoursesReport', GetManageCoursesReport);
router.get('/ManageStudentCoursesReport', getManageStudentCoursesReport);

module.exports = router;