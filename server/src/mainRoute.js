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
router.get('/', signIn)
router.get('/authentication/signin', signIn);

router.get('/profile/read', readProfile);

module.exports = router;