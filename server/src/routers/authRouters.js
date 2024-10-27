const express = require("express");
const router = express.Router();

const authMiddlware = require('../middlewares/authentication');

const { signIn } = require('../apis/authenticationManagement/signIn/signInController');
const { signOut } = require('../apis/authenticationManagement/signOut/signOutController');
const { signUp } = require('../apis/authenticationManagement/signUp/signUpController');

router.post('/signin', authMiddlware.isNotSignedIn, signIn);
router.post('/signout', authMiddlware.isSignedIn, signOut);
router.post('/signup', authMiddlware.isNotSignedIn, signUp);
router.get('/status', authMiddlware.isNotSignedIn, authMiddlware.isSignedIn);

module.exports = router;
