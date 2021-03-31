const testConfig = {
    user: process.env.DB_USER || "sql11401143",
    database: process.env.DB_DATABASE || 'sql11401143',
    password: process.env.DB_PASSWORD || 'ndxJCCMRWI',
    host: process.env.DB_HOST || 'sql11.freemysqlhosting.net',
    port: process.env.PORT || 3306,
    secret: process.env.JWT_SECRET || "3pKrm1220zvvHzPaowZ96a0OOZdbzXObI9FDMgWYqgjo"
}

export = testConfig;