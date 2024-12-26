const sql = require('mssql');
const config = require('./ncdbConfig.json');
require('dotenv').config();

const tryConnect = async (role) => {
    try {
        const dbConfig = {
            ...config,
            user: role,
            password: process.env[`${role}_PASSWORD`],
        };

        const pool = new sql.ConnectionPool(dbConfig);
        await pool.connect();

        return pool;
    } catch (err) {
        throw new Error(`tryConnect | ${err.message}`);
    }
};

const closeConnect = async (pool) => {
    try {
        if (pool && pool.connected) {
            await pool.close();
        } else {
            throw new Error(`There is no NavCareerDB connection to close.`);
        }
    } catch (err) {
        throw new Error(`closeConnect | ${err.message}`);
    }
};

const query = async (role, queryString, params = {}) => {
    let pool;
    try {
        pool = await tryConnect(role);

        if (!pool || !pool.connected) 
            throw new Error(`There is no NavCareerDB connection to query.`);

        const request = pool.request();

        for (const [key, value] of Object.entries(params)) {
            request.input(key, value);
        }

        console.log('\x1b[34m%s\x1b[0m', `[${new Date().toLocaleString()}] at ncbdService.js/queryDB | Querying NavCareerDB: ${queryString} => ${JSON.stringify(params)}`);

        const results = await request.query(queryString);

        return results.recordset;
    } catch (err) {
        throw new Error(`ncbdService.js/query | ${err.message}`);
    } finally {
        if (pool) {
            await closeConnect(pool);
        }
    }
};

module.exports = { query };
