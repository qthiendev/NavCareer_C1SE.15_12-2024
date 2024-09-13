const express = require('express');
const router = require('./mainRoute');

const app = express();
const port = 5000;

app.use('/', router);

app.listen(port, () => {
    console.log(`</> Listening on port ${port}.`);
    console.log(`</> ACCESS LINK: http://localhost:${port}.`);
});