import { notFound } from 'next/navigation';
import { getCardById, getCardsByCategory } from '@/lib/db/cards';
import CardDetailContent from './card-detail-content';

export default async function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = await getCardById(id);

  if (!card) {
    notFound();
  }

  const categoryCards = await getCardsByCategory(card.category);
  const relatedCards = categoryCards.filter((c) => c.id !== card.id).slice(0, 4);

  return <CardDetailContent card={card} relatedCards={relatedCards} />;
}
