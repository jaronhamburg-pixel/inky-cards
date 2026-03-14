import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getSavedDesignsByUserId, createSavedDesign } from '@/lib/db/saved-designs';
import { savedDesignSchema } from '@/lib/utils/validation';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const designs = await getSavedDesignsByUserId(user.id);
  return NextResponse.json({ designs });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = savedDesignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const design = await createSavedDesign(
    user.id,
    parsed.data.cardId,
    parsed.data.name,
    parsed.data.customization,
  );

  return NextResponse.json({ design }, { status: 201 });
}
