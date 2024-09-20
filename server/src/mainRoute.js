const express = require("express");
const router = express.Router();

const { queryDB } = require('./apis/database/queryDBService');

router.get("/", (req, res) => { res.json(''); });

router.get("/test/query", async (req, res) => {
    const { queryString } = req.query;
    data = await queryDB('sa', queryString, {});
    res.json(data);
});

module.exports = router;