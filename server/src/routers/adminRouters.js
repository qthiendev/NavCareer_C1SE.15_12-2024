const express = require("express");
const router = express.Router();

const authMiddleware = require('../middlewares/authentication');
const authzMiddleware = require('../middlewares/authorization');

const { readAll } = require('../apis/systemManagement/userManagement/readAll/readAllController');

router.get('', async (req, res) => {
    const htmlResponse = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ADMIN</title>
    <style>
        body {
            text-align: center;
            font-family: Arial, sans-serif;
            background-image: url('https://www.transparenttextures.com/patterns/paper.png'); /* Replace with floral image */
            background-color: #f9f9f9; 
            color: #333;
            background-size: cover;
            padding: 50px;
        }
        h1 {
            color: #d9534f;
        }
        p {
            font-size: 1.2em;
        }
        img {
            width: 400px;
            height: auto;
            border: 5px solid #d9534f;
            border-radius: 10px;
        }
        .flower-bg {
            background-image: url('https://images.pexels.com/photos/1101993/pexels-photo-1101993.jpeg'); /* Floral Background */
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.3; /* Adjust opacity for visibility */
            z-index: -1; /* Send the background to the back */
        }
    </style>
</head>
<body>
    <div class="flower-bg"></div>
    <h1>🚨 Warning! 🚨</h1>
    <p>This is an admin-only zone! 🛑</p>
    <p>Trying to hack our product? That's a big no-no! 🥳</p>
    <p>Instead, why not take a moment to enjoy this delightful cat? 🐱</p>
    <img src="https://t3.ftcdn.net/jpg/01/12/14/98/360_F_112149875_ep552VhV2ZF57LpaLg92Y3B3NvRZ7GIc.jpg" alt="Cat Image" />
    <p>Remember: Cats are not just cute; they're excellent at guarding secrets! 😸</p>
    <p>So, unless you want a furball as a companion, stay out of our admin routes!</p>
</body>
</html>

    `;

    res.status(201).send(htmlResponse);
});

router.get('/user/read', authMiddleware.isSignedIn, authzMiddleware.admin, readAll);

module.exports = router;
