const express = require('express');
const router = express.Router();

const { createCourse } = require('../apis/CourseManagement/createCourse/createCourseController');
const { readMaterial } = require('../apis/courseManagement/readMaterial/readMaterialController');
const { updateCourse } = require('../apis/CourseManagement/updateCourse/updateCourseController');
const { deleteCourse } = require('../apis/CourseManagement/deleteCourse/deleteCourseController');

router.get('/create', createCourse);
router.get('/read', readMaterial);
router.get('/update', updateCourse);
router.get('/delete', deleteCourse);

module.exports = router;
