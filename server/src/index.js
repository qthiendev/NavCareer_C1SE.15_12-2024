const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const redis = require('redis');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const now = new Date();

const app = express();
const PORT = 5000;
//const numCores = os.cpus().length;
const numCores = 1;

let useRedis = true;

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

const redisClient = redis.createClient({
    url: 'redis://127.0.0.1:6379',
    socket: {
        reconnectStrategy: (retries) => {
            console.error(`[${now.toLocaleString()}] Redis connection attempt ${retries}`);
            return retries > 3 ? new Error('Retry limit reached') : 1000; // Retry 3 times
        },
    },
});

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log(`[${now.toLocaleString()}] Connected to Redis successfully.`);
        monitorRedis(); // Start monitoring Redis events
    } catch (err) {
        console.error(`[${now.toLocaleString()}] Failed to connect to Redis:`, err.message);
        useRedis = false;
    }
}

function monitorRedis() {
    redisClient.on('error', (err) => {
        console.error(`[${now.toLocaleString()}] Redis error:`, err.message);
        handleCriticalFailure();
    });

    redisClient.on('end', () => {
        console.error(`[${now.toLocaleString()}] Redis connection lost.`);
        handleCriticalFailure();
    });
}

function handleCriticalFailure() {
    console.error(`[${now.toLocaleString()}] Critical error detected. Restarting server...`);
    process.exit(1); // Exit the process to trigger a restart
}

function setupMiddleware(app) {
    app.use(cors(corsOptions));
    app.use(cookieParser());

    const sessionOptions = {
        secret: 'NavCareerProject',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    };

    if (useRedis) {
        const store = new RedisStore({ client: redisClient });
        sessionOptions.store = store;
        console.log(`[${now.toLocaleString()}] Using Redis as session store.`);
    } else {
        console.log(`[${now.toLocaleString()}] Falling back to in-memory session store.`);
    }

    app.use(session(sessionOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        if (!req.session.role) {
            req.session.role = 'NAV_GUEST';
        }
        next();
    });
}

async function startApp() {
    await connectRedis();

    if (useRedis && cluster.isMaster) {
        console.clear();
        console.log(`[${now.toLocaleString()}] Master process running on PID: ${process.pid}`);

        for (let i = 0; i < numCores; i++) {
            const worker = cluster.fork();
            console.log(`Forked worker with PID: ${worker.process.pid}`);
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`[${now.toLocaleString()}] Worker ${worker.process.pid} died. Respawning...`);
            cluster.fork();
        });
    } else {
        setupMiddleware(app);

        app.use('/', require('./mainRouter'));

        app.listen(PORT, () => {
            console.log(`[${now.toLocaleString()}] Worker process [PID: ${process.pid}] running on http://localhost:${PORT}`);
        });
    }
}

startApp();
