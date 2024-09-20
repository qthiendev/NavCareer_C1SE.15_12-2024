const express = require('express');
const router = express.Router();

const { queryDB } = require('./apis/database/queryDBService');
const { signIn } = require('./apis/authentications/signIn/signInController');

const { readProfile } = require('./apis/profileManagement/readProfile/readProfileController');

//test router
router.get('/test/serverstatus', (req, res) => { res.json(`Hi, I'm handsome dev @decseize, I wonder wot you doing here.`); });
router.get('/test/query', async (req, res) => {
    const { queryString } = req.query;
    data = await queryDB('sa', queryString, {});
    res.json(data);
});

// main router
router.get('/', (req, res) => { });

router.get('/authentication/signin', signIn);
router.get('/authentication/signup', signIn);
router.get('/authentication/resetpassword', signIn);

router.get('/profile/create', readProfile);
router.get('/profile/read', readProfile);
router.get('/profile/update', readProfile);
router.get('/profile/delete', readProfile);

router.get('/course/create', readProfile);
router.get('/course/read', readProfile);
router.get('/course/update', readProfile);
router.get('/course/delete', readProfile);

router.get('/enrollment/enroll', readProfile);
router.get('/enrollment/disenroll', readProfile);

module.exports = router;