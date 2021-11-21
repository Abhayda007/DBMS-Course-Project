const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'udemy',
    password: '842359',
    port: 5432,
})

module.exports = pool