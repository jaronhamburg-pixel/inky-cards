import { NextResponse } from 'next/server';
import { getUserByEmail, createUser, toPublicUser } from '@/lib/db/users';
import { signUserToken } from '@/lib/auth/jwt';
import { signUpSchema } from '@/lib/utils/validation';
import { sanitizeText } from '@/lib/utils/sanitize';
import { sendWelcomeEmail } from '@/lib/email/send';

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

    const { email, password } = parsed.data;
    const firstName = sanitizeText(parsed.data.firstName);
    const lastName = sanitizeText(parsed.data.lastName);

    if (await getUserByEmail(email)) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const user = await createUser(email, password, firstName, lastName);
    const token = await signUserToken(user.id, user.email);

    try {
      await sendWelcomeEmail(email, firstName);
    } catch (err) {
      console.error('Failed to send welcome email:', err);
    }

    const response = NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
    response.cookies.set('user-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
