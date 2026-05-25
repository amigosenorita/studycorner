const { Pool } = require('pg');

if (process.env.DB_PASSWORD === 'CHANGE_THIS_TO_YOUR_POSTGRES_PASSWORD') {
    throw new Error('Set your real PostgreSQL password in server/.env DB_PASSWORD before starting the API.');
}

const pool = new Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || ''),
    database: process.env.DB_NAME || 'admission_crm',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function query(sql, params = []) {
    const result = await pool.query(sql, params);
    return result.rows;
}

async function getOne(sql, params = []) {
    const rows = await query(sql, params);
    return rows[0] || null;
}

module.exports = { pool, query, getOne };
