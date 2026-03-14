import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getSignificantDates, addSignificantDate } from '@/lib/db/significant-dates';
import { significantDateSchema } from '@/lib/utils/validation';
import { sanitizeObject } from '@/lib/utils/sanitize';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const dates = await getSignificantDates(user.id);
  return NextResponse.json({ dates });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = significantDateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const date = await addSignificantDate(user.id, sanitizeObject(parsed.data));
    if (!date) {
      return NextResponse.json({ error: 'Failed to add date' }, { status: 500 });
    }

    return NextResponse.json({ date }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
