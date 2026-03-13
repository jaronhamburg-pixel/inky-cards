import { NextRequest, NextResponse } from 'next/server';
import { setResetToken } from '@/lib/db/users';
import { sendPasswordResetEmail } from '@/lib/email/send';
import { forgotPasswordSchema } from '@/lib/utils/validation';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const result = await setResetToken(email);

    // Always return 200 to prevent email enumeration
    if (result) {
      try {
        await sendPasswordResetEmail(email, result.firstName, result.token);
      } catch (err) {
        console.error('Failed to send password reset email:', err);
      }
    }

    return NextResponse.json({
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
