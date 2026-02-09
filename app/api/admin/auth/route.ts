import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminSecret = process.env.ADMIN_SECRET || 'admin123';

    if (password !== adminSecret) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set('admin-session', adminSecret, {
      httpOnly: true,
      path: '/admin',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
