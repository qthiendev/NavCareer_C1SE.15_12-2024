const sql = require('mssql');
const config = require('./ncdbConfig.json');
require('dotenv').config()

let connection;

const tryConnect = async (role) => {
    try {
        const dbConfig = {
            ...config,
            user: role,
            password: process.env[`${role}_PASSWORD`]
        };
        
        connection = new sql.ConnectionPool(dbConfig);

        await connection.connect();

    } catch (err) {
        throw new Error(`tryConnect() | ${err.message}`);
    }
};

const closeConnect = async () => {
    try {
        if (connection && connection.connected) {
            await connection.close();
        } else {
            throw new Error(`There is no NavCareerDB connection to close.`);
        }
    } catch (err) {
        throw new Error(`closeConnect() | ${err.message}`);
    }
};

const query = async (role, queryString, params = {}) => {
    try {
        await tryConnect(role);

        if (!connection || !connection.connected) 
            throw new Error(`There is no NavCareerDB connection to query.`);

        const request = connection.request();

        for (const [key, value] of Object.entries(params)) {
            request.input(key, value);
        }

        console.log(`[${new Date().toLocaleString()}] at ncbdService.js/queryDB | Querying NavCareerDB: ${queryString} -> ${JSON.stringify(params)}`);

        const results = await request.query(queryString);

        await closeConnect();

        return results.recordset;
    } catch (err) {
        throw new Error(`ncbdService.js/query | ${err.message}`);
    }
};

module.exports = { query };