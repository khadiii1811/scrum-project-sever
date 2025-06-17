import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'leave_management',
    port: process.env.DB_PORT || 5432
  },
  pool: { min: 0, max: 10 }
});

export default db;