import { config as configDotenv } from 'dotenv';
configDotenv();

const config = {
    user: process.env.DB_USER || "sql11401137",
    database: process.env.DB_DATABASE || 'sql11401137',
    password: process.env.DB_PASSWORD || 'kSdbm23w9n',
    host: process.env.DB_HOST || 'sql11.freemysqlhosting.net',
    port: process.env.PORT || 3306,
    secret: process.env.JWT_SECRET || "3pKrm1220zvvHzPaowZ96a0OOZdbzXObI9FDMgWYqgjo"
}

module.exports = {
    config
}