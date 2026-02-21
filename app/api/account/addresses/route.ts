import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserById, addUserAddress, toPublicUser } from '@/lib/data/mock-users';
import { addressSchema } from '@/lib/utils/validation';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json({ addresses: user.addresses });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const address = addUserAddress(user.id, parsed.data);
    if (!address) {
      return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
    }

    return NextResponse.json({ address }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
