const express = require('express');
const router = express.Router();
const { queryDB } = require('../apis/database/queryDBService');

router.get('/serverstatus', (req, res) => {
    res.json(`Hi, I'm handsome dev @decseize, I wonder wot you doing here.`);
});

router.get('/query', async (req, res) => {
    const { queryString } = req.query;
    const data = await queryDB('sa', queryString, {});
    res.json(data);
});

module.exports = router;
