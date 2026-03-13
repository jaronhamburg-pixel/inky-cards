import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is required');
  return new TextEncoder().encode(secret);
};

export interface UserTokenPayload extends JWTPayload {
  sub: string; // userId
  email: string;
  role: 'user';
}

export interface AdminTokenPayload extends JWTPayload {
  sub: string;
  role: 'admin';
}

export type TokenPayload = UserTokenPayload | AdminTokenPayload;

export async function signUserToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ email, role: 'user' } as UserTokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: 'admin' } as AdminTokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('admin')
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as TokenPayload;
  } catch {
    return null;
  }
}
