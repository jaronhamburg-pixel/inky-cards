import type { Metadata } from 'next';
import { getRecentReviews, getSiteRating } from '@/lib/db/reviews';
import ReviewsContent from './reviews-content';

export const metadata: Metadata = {
  title: 'Customer Reviews | Inky Cards',
  description: 'Read what our customers say about their Inky Cards experience.',
};

export const revalidate = 3600;

export default async function ReviewsPage() {
  const [reviews, siteRating] = await Promise.all([
    getRecentReviews(),
    getSiteRating(),
  ]);

  return <ReviewsContent reviews={reviews} siteRating={siteRating} />;
}
