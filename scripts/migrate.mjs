import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import pkg from 'pg';

config({ path: '.env.local' });

const { Pool } = pkg;


const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

  try {
    await pool.query(schema);
    console.log('Migration complete: tables created.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();