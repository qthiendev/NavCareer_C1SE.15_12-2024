const express = require('express');
const router = require('./mainRouter');
const cors = require("cors");
const now = new Date();

const app = express();
const port = 5000;

const corsOptions = {
    local: ["http://localhost:5173/"]
};

app.use(cors(corsOptions))
app.use('/', router);
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`[${now.toLocaleString()}] at index.js| ACCESS LINK: http://localhost:${port}`);
});