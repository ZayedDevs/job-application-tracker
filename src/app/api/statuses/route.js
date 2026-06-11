import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/statuses
export async function GET() {
  try {
    const result = await query('SELECT id, label FROM statuses ORDER BY id');
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('GET /api/statuses failed:', err.message);
    return NextResponse.json(
      { error: 'Failed to fetch statuses' },
      { status: 500 }
    );
  }
}