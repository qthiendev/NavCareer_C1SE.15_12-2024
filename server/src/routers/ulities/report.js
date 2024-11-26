const express = require("express");
const router = express.Router();

const authMiddleware = require('../../middlewares/authentication');
const authzMiddleware = require('../../middlewares/authorization');
const { GetManageCoursesReport } = require('../../apis/utilities/report/getManageCoursesReport/getManageCoursesReportCotroller');
const { GetUserEnroll } = require('../../apis/utilities/report/getUserEnroll/getUserEnrollCotroller');

router.get('/ManageCoursesReport',authMiddleware.isSignedIn, authzMiddleware.esp, GetManageCoursesReport);
router.get('/GetUserEnroll', GetUserEnroll);


module.exports = router;