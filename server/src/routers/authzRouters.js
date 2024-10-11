const express = require("express");
const router = express.Router();

const authMiddlware = require('../middlewares/authentication');
const authzMiddlware = require('../middlewares/authorization');

router.get('/stu',
    authMiddlware.isSignedIn,
    authzMiddlware.student,
    async (req, res) => {
        res.status(200).json({
            message: 'This is student',
        });
    }
);

router.get('/adm',
    authMiddlware.isSignedIn,
    authzMiddlware.admin,
    async (req, res) => {
        res.status(200).json({
            message: 'This is admin',
        });
    }
);

router.get('/esp',
    authMiddlware.isSignedIn,
    authzMiddlware.esp,
    async (req, res) => {
        res.status(200).json({
            message: 'This is esp',
        });
    }
);

module.exports = router;
