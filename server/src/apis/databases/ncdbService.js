const sql = require('mssql');
const config = require('./ncdbConfig.json');
const now = new Date();

let connection;

const tryConnect = async (userType) => {
    try {
        const userConfig = config.connections.find(conn => conn.name === userType);

        if (!userConfig) 
            throw new Error(`User '${userType}' not found.`);
        
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

        for (const [key, value] of Object.entries(params)) 
            request.input(key, value); 

        const results = await request.query(queryString);

        console.log(`[${now.toLocaleString()}] at ncbdService.js/queryDB() | Queried NavCareerDB.`);
        // console.log(queryString);
        // console.log(results.recordset);

        await closeConnect();
        
        return results.recordset;
    } catch (err) {
        throw new Error(`ncbdService.js/query() | ${err.message}`);
    }
};

module.exports = { query };