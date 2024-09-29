const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const mainRouter = require('./mainRouter');

const app = express();
const PORT = 5000;

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

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
app.use(express.urlencoded({
    extended: true
}));

app.use('/', mainRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
