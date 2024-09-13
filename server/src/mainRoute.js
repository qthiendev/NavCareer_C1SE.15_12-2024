const express = require("express");
const router = express.Router();

const { query } = require('./services/database/connectTestDB');
const { signIn } = require("./controllers/authentications/signInController");

router.get("/", (req, res) => {
    res.json('');
});

// router.get("/TestDBCheck", async (req, res) => {
//     try {
//         const results = await query('sa', 'select * from AUTH');
//         res.json(results);  // Send the results as a JSON response
//     } catch (err) {
//         res.status(500).send('Error querying the database');
//         console.error(err);
//     }
// });

// router.get("/test", (req, res) => {
//     res.json({ 'user': ['user1', 'user2', 'user3'] })
// });

router.get("/authentication/signin", signIn);

module.exports = router;