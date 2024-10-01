const express = require("express");
const router = express.Router();

const { query } = require('../apis/databases/ncdbService');

router.get('/query', async (req, res) => {
    try {
        const data = await query('sa', req.body.s, {});
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;