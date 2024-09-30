const express = require("express");
const router = express.Router();

const { authCheck } = require('../middlewares/authCheck');

const { signIn } = require('../apis/authenticationManagement/signIn/signInController');
const { signOut } = require('../apis/authenticationManagement/signOut/signOutController');
const { signUp } = require('../apis/authenticationManagement/signUp/signUpController');

router.post('/signin', authCheck, signIn);
router.post('/signout', authCheck, signOut);
router.post('/signup', authCheck, signUp);

module.exports = router;
