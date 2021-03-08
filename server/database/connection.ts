const { config } = require('../config');

const mysql = require('mysql');
const connection = mysql.createPool({
    user: config.user,
    database: config.database,
    password: config.password,
    host: config.host,
    port: config.port,
    // ssl: true
});

export = connection;