import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getOrdersByUserId, getOrdersByEmail } from '@/lib/db/orders';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Try userId first, fall back to email match
  let orders = await getOrdersByUserId(user.id);
  if (orders.length === 0) {
    orders = await getOrdersByEmail(user.email);
  }

  return NextResponse.json({ orders });
}
