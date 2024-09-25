const express = require('express');
const router = express.Router();

const { createCourse } = require('../apis/CourseManagement/createCourse/createCourseController');
const { readCourse } = require('../apis/CourseManagement/readCourse/readCourseController');
const { updateCourse } = require('../apis/CourseManagement/updateCourse/updateCourseController');
const { deleteCourse } = require('../apis/CourseManagement/deleteCourse/deleteCourseController');

router.get('/create', createCourse);
router.get('/read', readCourse);
router.get('/update', updateCourse);
router.get('/delete', deleteCourse);

module.exports = router;
