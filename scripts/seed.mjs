import { config } from 'dotenv';
import pkg from 'pg';

config({ path: '.env.local' });

const { Pool } = pkg;

const STATUSES = [
  'Applied',
  'Interview Scheduled',
  'Offer Received',
  'Rejected',
  'Withdrawn',
];

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    for (const label of STATUSES) {
      await pool.query(
        'INSERT INTO statuses (label) VALUES ($1) ON CONFLICT (label) DO NOTHING',
        [label]
      );
    }
    console.log(`Seed complete: ${STATUSES.length} statuses ensured.`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();