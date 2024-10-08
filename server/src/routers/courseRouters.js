const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication');
const authzMiddleware = require('../middlewares/authorization');

const { createCourse } = require('../apis/CourseManagement/createCourse/createCourseController');
const { readCourse } = require('../apis/CourseManagement/readCourse/readCourseController');
const { updateCourse } = require('../apis/CourseManagement/updateCourse/updateCourseController');
//const { deleteCourse } = require('../apis/CourseManagement/deleteCourse/deleteCourseController');

router.post('/create', authMiddleware.isSignedIn, authzMiddleware.esp, createCourse);
router.get('/read', readCourse);
router.post('/update', authMiddleware.isSignedIn, authzMiddleware.esp, updateCourse);
//router.delete('/delete', deleteCourse);

module.exports = router;
