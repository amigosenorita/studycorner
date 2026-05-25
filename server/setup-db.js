require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const dbName = process.env.DB_NAME || 'admission_crm';
const baseConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || ''),
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

function quoteIdentifier(value) {
    return `"${String(value).replace(/"/g, '""')}"`;
}

async function main() {
    const adminClient = new Client({ ...baseConfig, database: 'postgres' });
    await adminClient.connect();

    const existing = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (existing.rowCount === 0) {
        await adminClient.query(`CREATE DATABASE ${quoteIdentifier(dbName)}`);
        console.log(`Created database ${dbName}`);
    } else {
        console.log(`Database ${dbName} already exists`);
    }

    await adminClient.end();

    const appClient = new Client({ ...baseConfig, database: dbName });
    await appClient.connect();
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await appClient.query(schema);
    await appClient.end();

    console.log('Schema loaded successfully');
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
