import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/applications/:id
export async function GET(request, { params }) {
  const { id } = await params;

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
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(`GET /api/applications/${id} failed:`, err.message);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

// PUT /api/applications/:id
export async function PUT(request, { params }) {
  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body must be valid JSON' },
      { status: 400 }
    );
  }

  const ALLOWED = ['company', 'role', 'date_applied', 'status_id', 'notes'];
  const updates = {};
  for (const key of ALLOWED) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields provided to update' },
      { status: 400 }
    );
  }


  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClauses = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');


  values.push(id);
  const idParam = `$${values.length}`;

  try {
    const result = await query(
      `UPDATE applications
       SET ${setClauses}
       WHERE id = ${idParam}
       RETURNING id, company, role, date_applied, status_id, notes, created_at`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23503') {
      return NextResponse.json(
        { error: 'Invalid status_id: no matching status exists' },
        { status: 400 }
      );
    }
    console.error(`PUT /api/applications/${id} failed:`, err.message);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

// DELETE /api/applications/:id
export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    const result = await query(
      'DELETE FROM applications WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(`DELETE /api/applications/${id} failed:`, err.message);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}