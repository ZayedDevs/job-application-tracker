import { Pool } from 'pg';

const globalForPg = globalThis;

const pool =
  globalForPg._pgPool ||
  new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== 'production') {
  globalForPg._pgPool = pool;
}

export function query(text, params) {
  return pool.query(text, params);
}

export default pool;