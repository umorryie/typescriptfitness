import fs from 'fs';
import path from 'path';
const testConfig = require('./testDatabaseConfig');
const mysql = require('mysql');
const connection = mysql.createPool({
    user: testConfig.user,
    database: testConfig.database,
    password: testConfig.password,
    host: testConfig.host,
    port: testConfig.port,
    multipleStatements: true
});

const insertSql = fs.readFileSync(path.join(__dirname, '../../server/tests/insert.sql')).toString();

connection.query(insertSql, (err, result) => {

    connection.end();
});