import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { updateSignificantDate, deleteSignificantDate } from '@/lib/db/significant-dates';
import { significantDateSchema } from '@/lib/utils/validation';
import { sanitizeObject } from '@/lib/utils/sanitize';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = significantDateSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const date = await updateSignificantDate(user.id, id, sanitizeObject(parsed.data));
    if (!date) {
      return NextResponse.json({ error: 'Date not found' }, { status: 404 });
    }

    return NextResponse.json({ date });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteSignificantDate(user.id, id);
  if (!deleted) {
    return NextResponse.json({ error: 'Date not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
