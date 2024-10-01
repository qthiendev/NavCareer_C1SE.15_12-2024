const express = require("express");
const router = express.Router();

const authentication = require('../middlewares/authentication');

const { signIn } = require('../apis/authenticationManagement/signIn/signInController');
const { signOut } = require('../apis/authenticationManagement/signOut/signOutController');
const { signUp } = require('../apis/authenticationManagement/signUp/signUpController');
const { updateAuthentication } = require('../apis/authenticationManagement/editAuth/updateAuthenticationController');

router.post('/signin', signIn);
router.post('/signout', authentication.check, signOut);
router.post('/signup', signUp);
router.post('/update', authentication.check, updateAuthentication);
router.get('/status', 
    authentication.check,
    async (req, res) => {
        res.status(200).json({ 
            status: true,
            username: req.username 
        });
    }
);

module.exports = router;
