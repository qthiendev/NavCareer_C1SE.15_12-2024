const express = require("express");
const router = express.Router();

const { authCheck } = require('../middlewares/authCheck');

const { signIn } = require('../apis/authenticationManagement/signIn/signInController');
const { signOut } = require('../apis/authenticationManagement/signOut/signOutController');

router.post('/signin', signIn);
router.post('/signout', authCheck, signOut);

module.exports = router;
