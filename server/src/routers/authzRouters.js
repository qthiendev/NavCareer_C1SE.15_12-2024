const express = require("express");
const router = express.Router();

const authMiddlware = require('../middlewares/authentication');
const authzMiddlware = require('../middlewares/authorization');

router.get('/stu',
    authMiddlware.isSignedIn,
    authzMiddlware.student,
    async (req, res) => {
        try {
            return res.status(200).json({
                message: 'This is student',
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

router.get('/adm',
    authMiddlware.isSignedIn,
    authzMiddlware.admin,
    async (req, res) => {
        try {
            return res.status(200).json({
                message: 'This is admin',
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

router.get('/esp',
    authMiddlware.isSignedIn,
    authzMiddlware.esp,
    async (req, res) => {
        try {
            return res.status(200).json({
                message: 'This is esp',
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

module.exports = router;
