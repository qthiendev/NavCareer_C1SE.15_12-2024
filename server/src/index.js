const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { RedisStore } = require('connect-redis'); // Import the Redis session store
const redis = require('redis');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const now = new Date();

const app = express();
const PORT = 5000;
const numCores = os.cpus().length;

let useRedis = true; // Flag to toggle Redis usage

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

// Configure Redis client
const redisClient = redis.createClient({
    url: 'redis://127.0.0.1:6379',
});

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log(`[${now.toLocaleString()}] Connected to Redis successfully.`);
    } catch (err) {
        console.error(`[${now.toLocaleString()}] Failed to connect to Redis:`, err.message);
        useRedis = false; // Fallback to normal session if Redis connection fails
    }
}

// Middleware and session setup
function setupMiddleware(app) {
    app.use(cors(corsOptions));
    app.use(cookieParser());

    // Configure session store
    const sessionOptions = {
        secret: 'NavCareerProject',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            maxAge: 24 * 60 * 60 * 1000, // 1 day
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

    // Initialize default session role
    app.use((req, res, next) => {
        if (!req.session.role) {
            req.session.role = 'NAV_GUEST';
        }
        next();
    });
}

// Main app logic
async function startApp() {
    await connectRedis();

    if (useRedis && cluster.isMaster) {
        console.clear();
        console.log(`[${now.toLocaleString()}] Master process running on PID: ${process.pid}`);

        // Fork workers based on the number of CPU cores
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

        // Define your routes
        app.use('/', require('./mainRouter'));

        app.listen(PORT, () => {
            console.log(`[${now.toLocaleString()}] Worker process [PID: ${process.pid}] running on http://localhost:${PORT}`);
        });
    }
}

startApp();
