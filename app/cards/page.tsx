import type { Metadata } from 'next';
import { getAllCards } from '@/lib/db/cards';
import CardsContent from './cards-content';

export const metadata: Metadata = {
  title: 'Browse Cards',
  description: 'Explore our curated collection of premium greeting cards for every occasion.',
};

export default async function CardsPage() {
  const cards = await getAllCards();
  return <CardsContent cards={cards} />;
}
