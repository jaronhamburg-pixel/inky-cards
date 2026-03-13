import { getAllCards } from '@/lib/db/cards';
import CardsContent from './cards-content';

export default async function CardsPage() {
  const cards = await getAllCards();
  return <CardsContent cards={cards} />;
}
