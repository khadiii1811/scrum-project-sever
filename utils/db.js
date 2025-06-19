import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Tinhdeptrai1510200415102004%',
    database: process.env.DB_NAME || 'leave_management',
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false }
  },
  pool: { min: 0, max: 10 }
});

export default db;