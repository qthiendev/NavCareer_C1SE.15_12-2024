const express = require("express");
const router = express.Router();

router.get('', async (req, res) => {

    const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Server Status</title>
        </head>
        <body style="text-align: center; font-family: Arial, sans-serif;">
            <h1>Warning!</h1>
            <p>This server is protected! Attempting to hack our server is not allowed.</p>
            <img src="https://t3.ftcdn.net/jpg/01/12/14/98/360_F_112149875_ep552VhV2ZF57LpaLg92Y3B3NvRZ7GIc.jpg" alt="Cat Image" style="width: 400px; height: auto;" />
            <p>🐱</p>
        </body>
        </html>
    `;

    res.send(htmlResponse);
});

module.exports = router;
