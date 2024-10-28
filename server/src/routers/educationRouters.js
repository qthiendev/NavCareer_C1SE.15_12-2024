const express = require('express');
const router = express.Router();

const { enroll } = require('../apis/educationManagement/enrollCourse/enrollController');
// const { disenroll } = require('../apis/educationManagement/disenrollCourse/disenrollController');

const { getCollection, serveMedia, getFrame } = require('../apis/educationManagement/learning/getLearn/getLearnController');

router.post('/enroll', enroll);
// router.get('/disenroll', disenroll);

router.get('/collection', getCollection);
router.get('/frame', getFrame);
router.get('/media', serveMedia);

module.exports = router;
