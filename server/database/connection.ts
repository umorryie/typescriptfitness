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
        multipleStatements: true
        // ssl: true
    });
}

export = connection;