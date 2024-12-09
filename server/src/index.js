const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const redis = require('ioredis');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const now = new Date();

const app = express();
const PORT = 5000;
const numCores = os.cpus().length;

const redisClient = redis.createClient({ url: 'redis://127.0.0.1:6379' });

redisClient.connect().catch((err) => console.error(`[${now.toLocaleString()}] Redis connection error:`, err));

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

if (cluster.isMaster) {
    console.clear();
    console.log(`[${now.toLocaleString()}] Master process running on PID: ${process.pid}`);

    // Fork workers
    for (let i = 0; i < numCores; i++) {
        const worker = cluster.fork();
        console.log(`Forked worker with PID: ${worker.process.pid}`);
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`[${now.toLocaleString()}] Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}`);
        console.log(`[${now.toLocaleString()}] Respawning worker...`);
        const newWorker = cluster.fork();
        console.log(`[${now.toLocaleString()}] Forked new worker with PID: ${newWorker.process.pid}`);
    });
} else {
    app.use((req, res, next) => {
        const method = req.method;
        const url = req.originalUrl;
        const pid = process.pid;
        console.log(`[${now.toLocaleString()}] ${method} request to ${url} handled by worker PID: ${pid}`);
        next();
    });

    app.use(cors(corsOptions));
    app.use(cookieParser());

    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: 'NavCareerProject',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        if (!req.session.role) {
            req.session.role = req.session.role || 'NAV_GUEST';
        }
        next();
    });

    app.use('/', require('./mainRouter'));

    app.listen(PORT, () => {
        console.log(`[${now.toLocaleString()}] Worker process [PID: ${process.pid}] running on http://localhost:${PORT}`);
    });
}
