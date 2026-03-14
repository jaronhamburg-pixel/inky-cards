import { NextResponse } from 'next/server';
import { getRecentReviews, getSiteRating } from '@/lib/db/reviews';

export async function GET() {
  const [reviews, siteRating] = await Promise.all([
    getRecentReviews(),
    getSiteRating(),
  ]);
  return NextResponse.json({ reviews, siteRating });
}
