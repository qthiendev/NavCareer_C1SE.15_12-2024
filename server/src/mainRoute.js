const express = require("express");
const router = express.Router();

const { query } = require('./services/database/connectTestDB');
const { signIn } = require("./controllers/authentications/signInController");
const { getProfile } = require("./controllers/accountManagement/profileController");

router.get("/", (req, res) => { res.json(''); });
router.get("/signin/get", signIn);
router.get("/profile/get", getProfile);

module.exports = router;