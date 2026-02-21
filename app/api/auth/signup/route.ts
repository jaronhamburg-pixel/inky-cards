import { NextResponse } from 'next/server';
import { getUserByEmail, createUser, toPublicUser } from '@/lib/data/mock-users';
import { signUpSchema } from '@/lib/utils/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName } = parsed.data;

    if (getUserByEmail(email)) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const user = createUser(email, password, firstName, lastName);

    const response = NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
    response.cookies.set('user-session', user.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
