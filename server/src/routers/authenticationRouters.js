const express = require('express');
const router = express.Router();

const { signIn } = require('../apis/authentications/signIn/signInController');
const { signUp } = require('../apis/authentications/signUp/signUpController');
const { resetPassword } = require('../apis/authentications/resetPassword/resetPasswordController');
const { deleteAccount } = require('../apis/authentications/deleteAccount/deleteAccountController');

router.get('/signin', signIn);
router.get('/signup', signUp);
router.get('/reset', resetPassword);
router.get('/delete', deleteAccount);

module.exports = router;
