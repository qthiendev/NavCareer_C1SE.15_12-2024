const express = require("express");
const router = express.Router();

const { authCheck } = require('../middlewares/authCheck');

const { signIn } = require('../apis/authenticationManagement/signIn/signInController');
const { signOut } = require('../apis/authenticationManagement/signOut/signOutController');
const { signUp } = require('../apis/authenticationManagement/signUp/signUpController');
const { updateAuthentication } = require('../apis/authenticationManagement/editAuth/updateAuthenticationController');

router.post('/signin', signIn);
router.post('/signout', authCheck, signOut);
router.post('/signup', signUp);
router.post('/update', authCheck, updateAuthentication);

module.exports = router;
