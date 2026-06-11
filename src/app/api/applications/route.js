import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/applications
export async function GET() {
  try {
    const result = await query(
      `SELECT
         a.id,
         a.company,
         a.role,
         a.date_applied,
         a.status_id,
         s.label AS status_label,
         a.notes,
         a.created_at
       FROM applications a
       JOIN statuses s ON s.id = a.status_id
       ORDER BY a.created_at DESC`
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('GET /api/applications failed:', err.message);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST /api/applications
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body must be valid JSON' },
      { status: 400 }
    );
  }

  const { company, role, date_applied, status_id, notes } = body;

  const missing = [];
  if (!company) missing.push('company');
  if (!role) missing.push('role');
  if (!date_applied) missing.push('date_applied');
  if (!status_id) missing.push('status_id');

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required field(s): ${missing.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    const result = await query(
      `INSERT INTO applications (company, role, date_applied, status_id, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, company, role, date_applied, status_id, notes, created_at`,
      [company, role, date_applied, status_id, notes ?? null]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    // 23503 = Postgres foreign_key_violation: status_id points at no real status.
    if (err.code === '23503') {
      return NextResponse.json(
        { error: 'Invalid status_id: no matching status exists' },
        { status: 400 }
      );
    }
    console.error('POST /api/applications failed:', err.message);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}