import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { updateUserAddress, deleteUserAddress } from '@/lib/data/mock-users';
import { addressSchema } from '@/lib/utils/validation';

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
    const parsed = addressSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const address = updateUserAddress(user.id, id, parsed.data);
    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({ address });
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
  const deleted = deleteUserAddress(user.id, id);
  if (!deleted) {
    return NextResponse.json({ error: 'Address not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
