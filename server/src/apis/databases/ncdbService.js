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

        console.log(`[${now.toLocaleString()}] at connectNavCareer.js/tryConnect() | Connected to NavCareerDB as '${userType}'.`);
    } catch (err) {
        throw new Error(`tryConnect() | Error >{${err.message}}<`);
    }
};

const closeConnect = async () => {
    try {
        if (connection && connection.connected) {
            await connection.close();
            console.log(`[${now.toLocaleString()}] at connectNavCareer.js/closeConnect() | Closed NavCareerDB connection.`);
        } else {
            throw new Error(`There is no NavCareerDB connection to close.`);
        }
    } catch (err) {
        throw new Error(`closeConnect() | Error >{${err.message}}<`);
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

        console.log(`[${now.toLocaleString()}] at connectNavCareer.js/queryDB() | Queried NavCareerDB.`);
        // console.log(queryString);
        // console.log(results.recordset);

        await closeConnect();
        
        return results.recordset;
    } catch (err) {
        throw new Error(`connectNavCareer.js/query() | ${err.message}`);
    }
};

module.exports = { query };