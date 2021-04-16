const { config } = require('../config');
const mysql = require('mysql');
let connection;
const localEnv = {
    user: 'root',
    database: 'test',
    password: 'root',
    host: 'localhost',
    port: 3306,
    multipleStatements: true
}

if (process.env.TEST === "test") {
    const testDatabaseConfig = require('../tests/testDatabaseConfig');
    connection = mysql.createPool(testDatabaseConfig);
} else {
    connection = mysql.createPool({
        user: config.user,
        database: config.database,
        password: config.password,
        host: config.host,
        port: config.port,
        multipleStatements: true,
        connectionLimit : 1000,
        connectTimeout  : 60 * 60 * 1000,
        acquireTimeout  : 60 * 60 * 1000,
        timeout         : 60 * 60 * 1000,
        // ssl: true
    });
}

export = connection;