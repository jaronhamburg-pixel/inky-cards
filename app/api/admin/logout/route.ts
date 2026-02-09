import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));

  response.cookies.set('admin-session', '', {
    httpOnly: true,
    path: '/admin',
    maxAge: 0,
  });

  return response;
}

export async function POST() {
  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));

  response.cookies.set('admin-session', '', {
    httpOnly: true,
    path: '/admin',
    maxAge: 0,
  });

  return response;
}
