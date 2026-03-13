import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { checkRateLimit, RATE_LIMITS } from '@/lib/middleware/rate-limit';

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyJWT(token: string): Promise<{ role: string; sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { role: payload.role as string, sub: payload.sub as string };
  } catch {
    return null;
  }
}

const userProtectedPaths: string[] = [];
const userProtectedApiPaths = ['/api/account'];
const adminProtectedPaths = ['/admin'];
const adminProtectedApiPaths = ['/api/admin'];
const adminExcludePaths = ['/admin/login'];
const adminExcludeApiPaths = ['/api/admin/auth'];

const authPaths = ['/api/auth/signin', '/api/auth/signup', '/api/admin/auth', '/api/auth/forgot-password', '/api/auth/reset-password'];
const generatePaths = ['/api/generate-card'];
const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

function matchesAny(pathname: string, paths: string[]): boolean {
  return paths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function rateLimitResponse(resetMs: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(resetMs / 1000)) },
    }
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const ip = getClientIP(request);

  // ── CSRF: Origin header check for mutating API requests ──
  if (pathname.startsWith('/api/') && mutatingMethods.includes(method)) {
    // Skip CSRF for Stripe webhooks and UploadThing (use their own security)
    if (!pathname.startsWith('/api/webhooks/') && !pathname.startsWith('/api/uploadthing')) {
      const origin = request.headers.get('origin');
      if (origin) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const allowedHost = new URL(appUrl).host;
        const originHost = new URL(origin).host;
        if (originHost !== allowedHost) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }
    }
  }

  // ── Rate limiting ──
  if (matchesAny(pathname, authPaths)) {
    const result = checkRateLimit(`auth:${ip}`, RATE_LIMITS.auth);
    if (!result.allowed) return rateLimitResponse(result.resetMs);
  } else if (matchesAny(pathname, generatePaths)) {
    const result = checkRateLimit(`generate:${ip}`, RATE_LIMITS.generate);
    if (!result.allowed) return rateLimitResponse(result.resetMs);
  } else if (pathname.startsWith('/api/')) {
    const result = checkRateLimit(`general:${ip}`, RATE_LIMITS.general);
    if (!result.allowed) return rateLimitResponse(result.resetMs);
  }

  // ── Auth: Admin protected paths ──
  if (matchesAny(pathname, adminProtectedPaths) && !matchesAny(pathname, adminExcludePaths)) {
    const token = request.cookies.get('admin-session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== 'admin') {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.set('admin-session', '', { maxAge: 0, path: '/admin' });
      return response;
    }
    return NextResponse.next();
  }

  // ── Auth: Admin API paths ──
  if (matchesAny(pathname, adminProtectedApiPaths) && !matchesAny(pathname, adminExcludeApiPaths)) {
    const token = request.cookies.get('admin-session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // ── Auth: User protected paths ──
  if (matchesAny(pathname, userProtectedPaths)) {
    const token = request.cookies.get('user-session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== 'user') {
      const response = NextResponse.redirect(new URL('/signin', request.url));
      response.cookies.set('user-session', '', { maxAge: 0, path: '/' });
      return response;
    }
    return NextResponse.next();
  }

  // ── Auth: User API paths ──
  if (matchesAny(pathname, userProtectedApiPaths)) {
    const token = request.cookies.get('user-session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    '/api/:path*',
  ],
};
