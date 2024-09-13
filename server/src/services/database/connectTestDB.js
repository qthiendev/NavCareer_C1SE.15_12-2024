const sql = require("mssql");
const config = require("../../configs/testDB.json");

let connection;

const tryConnect = async (userType) => {
    try {
        const userConfig = config.connections.find(conn => conn.name === userType);

        if (!userConfig) {
            throw new Error(`<!> User configuration for "${userType}" not found.`);
        }

        connection = new sql.ConnectionPool(userConfig);
        await connection.connect();

        console.log("</> Connected to SQL Server | TestDB.");
    } catch (err) {
        console.log("<!> Failed to connect to SQL Server | TestDB.");
        console.log("<!>", err);
    }
};

const closeConnect = async () => {
    try {
        if (connection && connection.connected) {
            await connection.close();
            console.log("</> SQL Server connection closed | TestDB.");
        } else {
            console.log("<?> No active connection to close.");
        }
    } catch (err) {
        console.log("<!> Failed to close the SQL Server connection | TestDB.");
        console.log("<!>", err);
    }
};

const queryDB = async (queryString, params = {}) => {
    try {
        if (!connection || !connection.connected) {
            throw new Error("<!> No active database connection. Please connect first.");
        }

        const request = connection.request();

        for (const [key, value] of Object.entries(params)) {
            request.input(key, value);
        }

        const results = await request.query(queryString);

        console.log("</> Queried TestDB.");

        return results.recordset;
    } catch (err) {
        console.log("<!> Failed to query the SQL Server connection | TestDB.");
        console.log("<!>", err);
    }
};

const query = async (userType, queryString, params = {}) => {
    try {
        await tryConnect(userType);
        const results = await queryDB(queryString, params);
        await closeConnect();

        return results;
    } catch (err) {
        console.log("<!> Failed to query the SQL Server connection | TestDB.");
        console.log("<!>", err);
    }
}

module.exports = { query };