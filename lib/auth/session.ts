import { cookies } from 'next/headers';
import { getUserById, toPublicUser } from '@/lib/db/users';
import { verifyToken, type UserTokenPayload, type AdminTokenPayload } from '@/lib/auth/jwt';
import { PublicUser } from '@/types/user';

export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('user-session')?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'user') return null;

  const userPayload = payload as UserTokenPayload;
  const user = await getUserById(userPayload.sub!);
  if (!user) return null;

  return toPublicUser(user);
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-session')?.value;
  if (!token) return false;

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'admin') return false;

  return true;
}
