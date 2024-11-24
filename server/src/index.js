const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const mainRouter = require('./mainRouter');
const path = require('path');
const now = new Date();

const app = express();
const PORT = 5000;

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: 'NavCareerProject',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (!req.session.role) {
        req.session.role = req.session.role || 'NAV_GUEST';
    }
    next();
});

// Use your main router for routing
app.use('/', mainRouter);

// Start the server
app.listen(PORT, () => {
    console.clear();
    console.log('\x1b[32m%s\x1b[0m', `[${now.toLocaleString()}] at index.js | SERVER running on http://localhost:${PORT}`);
    console.log('\x1b[32m%s\x1b[0m', `[${now.toLocaleString()}] at index.js | CLIENT running on ${corsOptions.origin}`);
    //console.log('\x1b[31m%s\x1b[0m', 'This is red text');
    //console.log('\x1b[32m%s\x1b[0m', 'This is green text');
    //console.log('\x1b[34m%s\x1b[0m', 'This is blue text');
    //console.log('\x1b[33m%s\x1b[0m', 'This is yellow text');
    //console.log('\x1b[1m%s\x1b[0m', 'This is bold text');
});
