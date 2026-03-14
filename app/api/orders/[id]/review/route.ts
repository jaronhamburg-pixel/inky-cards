import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getReviewByOrderId, createReview, updateReview, deleteReview, getReviewById } from '@/lib/db/reviews';
import { getOrderById } from '@/lib/db/orders';
import { reviewSchema, reviewUpdateSchema } from '@/lib/utils/validation';

async function getOrderAndAuth(orderId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Sign in to manage reviews', status: 401 } as const;

  const order = await getOrderById(orderId);
  if (!order || order.userId !== user.id) {
    return { error: 'Order not found', status: 404 } as const;
  }
  if (order.paymentStatus !== 'succeeded') {
    return { error: 'Review only available for paid orders', status: 403 } as const;
  }

  return { user, order } as const;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await params;
  const review = await getReviewByOrderId(orderId);
  if (!review) {
    return NextResponse.json({ error: 'No review for this order' }, { status: 404 });
  }
  return NextResponse.json({ review });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await params;
  const auth = await getOrderAndAuth(orderId);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  try {
    const review = await createReview(auth.user.id, orderId, parsed.data);
    return NextResponse.json({ review }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'You have already reviewed this order' }, { status: 409 });
    }
    throw err;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await params;
  const auth = await getOrderAndAuth(orderId);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const existing = await getReviewByOrderId(orderId);
  if (!existing || existing.userId !== auth.user.id) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  const body = await request.json();
  const parsed = reviewUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const review = await updateReview(existing.id, parsed.data);
  return NextResponse.json({ review });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const existing = await getReviewByOrderId(orderId);
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  await deleteReview(existing.id);
  return NextResponse.json({ success: true });
}
