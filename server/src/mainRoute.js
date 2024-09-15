const express = require("express");
const router = express.Router();

const { query } = require('./services/database/connectTestDB');
const { signIn } = require("./controllers/authentications/signInController");

router.get("/", (req, res) => { res.json(''); });
router.get("/signin/service", signIn);

module.exports = router;