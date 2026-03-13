import { getAllCards } from '@/lib/db/cards';
import HomeContent from './home-content';

export default async function Home() {
  const allCards = await getAllCards();
  const featuredCards = allCards.slice(0, 10);
  return <HomeContent featuredCards={featuredCards} />;
}
