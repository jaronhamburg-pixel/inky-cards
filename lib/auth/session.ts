import { cookies } from 'next/headers';
import { getUserById, toPublicUser } from '@/lib/data/mock-users';
import { PublicUser } from '@/types/user';

export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user-session')?.value;
  if (!userId) return null;

  const user = getUserById(userId);
  if (!user) return null;

  return toPublicUser(user);
}
