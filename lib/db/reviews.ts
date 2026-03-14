import { prisma } from './prisma';
import type { Review, SiteRating } from '@/types/review';
import type { Review as PrismaReview, User as PrismaUser, Order as PrismaOrder } from '@/lib/generated/prisma';

function toReview(
  row: PrismaReview & {
    user: Pick<PrismaUser, 'firstName' | 'lastName'>;
    order: Pick<PrismaOrder, 'orderNumber'>;
  },
): Review {
  return {
    id: row.id,
    userId: row.userId,
    userName: `${row.user.firstName} ${row.user.lastName.charAt(0)}.`,
    orderId: row.orderId,
    orderNumber: row.order.orderNumber,
    rating: row.rating,
    title: row.title,
    content: row.content,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getRecentReviews(limit = 50): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    include: {
      user: { select: { firstName: true, lastName: true } },
      order: { select: { orderNumber: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return rows.map((row) => toReview(row));
}

export async function getSiteRating(): Promise<SiteRating> {
  const result = await prisma.review.aggregate({
    _avg: { rating: true },
    _count: { rating: true },
  });
  return {
    average: result._avg.rating ?? 0,
    count: result._count.rating,
  };
}

export async function getReviewByOrderId(orderId: string): Promise<Review | null> {
  const row = await prisma.review.findUnique({
    where: { orderId },
    include: {
      user: { select: { firstName: true, lastName: true } },
      order: { select: { orderNumber: true } },
    },
  });
  if (!row) return null;
  return toReview(row);
}

export async function createReview(
  userId: string,
  orderId: string,
  data: { rating: number; title: string; content: string },
): Promise<Review> {
  const row = await prisma.review.create({
    data: { userId, orderId, ...data },
    include: {
      user: { select: { firstName: true, lastName: true } },
      order: { select: { orderNumber: true } },
    },
  });
  return toReview(row);
}

export async function updateReview(
  id: string,
  data: { rating?: number; title?: string; content?: string },
): Promise<Review | null> {
  try {
    const row = await prisma.review.update({
      where: { id },
      data,
      include: {
        user: { select: { firstName: true, lastName: true } },
        order: { select: { orderNumber: true } },
      },
    });
    return toReview(row);
  } catch {
    return null;
  }
}

export async function deleteReview(id: string): Promise<boolean> {
  try {
    await prisma.review.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getReviewById(id: string): Promise<{ userId: string; orderId: string } | null> {
  return prisma.review.findUnique({ where: { id }, select: { userId: true, orderId: true } });
}
