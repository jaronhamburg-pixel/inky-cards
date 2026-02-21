import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { updateUser, getUserById, toPublicUser } from '@/lib/data/mock-users';
import { profileSchema } from '@/lib/utils/validation';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const updated = updateUser(currentUser.id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: toPublicUser(updated) });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
