require('dotenv').config();
const sql = require('mssql');
const config = require('./ncdbConfig.json');

let connection;
let secret_key;

const getUserConfig = (userType) => {
    const upperCaseUserType = userType.toUpperCase();

    const user = process.env[`${upperCaseUserType}_USER`];
    const password = process.env[`${upperCaseUserType}_PASSWORD`];
    const secretKey = process.env[`${upperCaseUserType}_SECRET_KEY`];

    if (!user || !password || !secretKey) {
        throw new Error(`Missing environment variables for user type '${upperCaseUserType}'.`);
    }

    return {
        ...config.sqlConfig,
        user: user,
        password: password,
        secret_key: secretKey
    };
};

const tryConnect = async (userType) => {
    try {
        const userConfig = getUserConfig(userType);
        secret_key = userConfig.secret_key;

        connection = new sql.ConnectionPool(userConfig);

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

const query = async (userType, queryString, params = {}) => {
    try {
        await tryConnect(userType);

        if (!connection || !connection.connected) 
            throw new Error(`There is no NavCareerDB connection to query.`);

        const request = connection.request();

        params.secret_key = secret_key;

        for (const [key, value] of Object.entries(params)) {
            request.input(key, value);
        }

        const results = await request.query(queryString);

        console.log(`[${new Date().toLocaleString()}] at ncbdService.js/queryDB() | Queried NavCareerDB: ${queryString} -> ${JSON.stringify(params)}`);

        await closeConnect();

        return results.recordset;
    } catch (err) {
        throw new Error(`ncbdService.js/query() | ${err.message}`);
    }
};

module.exports = { query };