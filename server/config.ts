import { config as configDotenv } from 'dotenv';
configDotenv();

const config = {
    user: process.env.DB_USER || "admin",
    database: process.env.DB_DATABASE || 'fitness',
    password: process.env.DB_PASSWORD || 'mypassword',
    host: process.env.DB_HOST || 'database-1.cciyq9rt9f5d.us-east-2.rds.amazonaws.com',
    port: process.env.PORT || 3306,
    secret: process.env.JWT_SECRET || "3pKrm1220zvvHzPaowZ96a0OOZdbzXObI9FDMgWYqgjo"
}

module.exports = {
    config
}