import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      console.error('ADMIN_SECRET environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { password } = await request.json();

    if (password !== adminSecret) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await signAdminToken();

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/admin',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
