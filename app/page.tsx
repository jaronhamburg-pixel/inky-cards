import { getAllCards } from '@/lib/db/cards';
import { getSiteRating, getRecentReviews } from '@/lib/db/reviews';
import HomeContent from './home-content';

export const revalidate = 3600;

export default async function Home() {
  const [allCards, siteRating, recentReviews] = await Promise.all([
    getAllCards(),
    getSiteRating(),
    getRecentReviews(4),
  ]);
  const featuredCards = allCards.slice(0, 10);
  return (
    <HomeContent
      featuredCards={featuredCards}
      siteRating={siteRating}
      recentReviews={recentReviews}
    />
  );
}
