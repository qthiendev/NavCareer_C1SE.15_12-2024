const express = require('express');
const router = require('./mainRoute');
const cors = require("cors");

const app = express();
const port = 5000;

const corsOptions = {
    local: ["http://localhost:5173/"]
};

app.use(cors(corsOptions))
app.use('/', router);
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`</> Listening on port ${port}.`);
    console.log(`</> ACCESS LINK: http://localhost:${port}.`);
});