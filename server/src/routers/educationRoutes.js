const express = require('express');
const router = express.Router();

const { enroll } = require('../apis/educationManagement/enrollCourse/enrollController');
const { disenroll } = require('../apis/educationManagement/disenrollCourse/disenrollController');

router.get('/enroll', enroll);
router.get('/disenroll', disenroll);

module.exports = router;
