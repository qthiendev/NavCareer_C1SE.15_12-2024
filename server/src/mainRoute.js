const express = require("express");
const router = express.Router();

const { queryDB } = require('./services/database/queryDB');
const { signIn } = require("./controllers/authentications/signInController");
const { getProfile } = require("./controllers/accountManagement/profileController");

router.get("/", (req, res) => { res.json(''); });
// router.get("/signin/get", signIn);
// router.get("/profile/get", getProfile);

router.get("/test/query", async (req, res) => {
    const { queryString } = req.query;
    data = await queryDB('sa', queryString, {});
    res.json(data);
});

module.exports = router;