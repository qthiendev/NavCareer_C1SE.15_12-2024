const express = require("express");
const router = express.Router();

const authMiddleware = require('../middlewares/authentication');
const authzMiddleware = require('../middlewares/authorization');

const { readAllCourse } = require('../apis/courseManagement/readUserCourses/readUserCoursesController');

router.get('/course/read-all', authMiddleware.isSignedIn, authzMiddleware.esp, readAllCourse);

module.exports = router;