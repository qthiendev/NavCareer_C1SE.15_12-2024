const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication');
const authzMiddleware = require('../middlewares/authorization');

const { createCourse } = require('../apis/courseManagement/createCourse/createCourseController');
const { readCourse } = require('../apis/courseManagement/readCourse/readCourseController');
const { updateCourse } = require('../apis/courseManagement/updateCourse/updateCourseController');
const { deleteCourse } = require('../apis/courseManagement/deleteCourse/deleteCourseController');
const {readFullCourse} = require('../apis/courseManagement/readFullCourse/readFullCourseController');

router.post('/create', authMiddleware.isSignedIn, authzMiddleware.esp, createCourse);
router.get('/read', readCourse);
router.post('/update', authMiddleware.isSignedIn, authzMiddleware.esp, updateCourse);
router.delete('/delete', authMiddleware.isSignedIn, authzMiddleware.esp, deleteCourse);
router.get('/read-full', authMiddleware.isSignedIn, authzMiddleware.esp, readFullCourse);

module.exports = router;
