import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCardById, getCardsByCategory } from '@/lib/db/cards';
import { productJsonLd } from '@/lib/seo/json-ld';
import CardDetailContent from './card-detail-content';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const card = await getCardById(id);
  if (!card) return {};
  return {
    title: card.title,
    description: card.description,
    openGraph: {
      images: [{ url: card.images.front, alt: card.title }],
    },
  };
}

export default async function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = await getCardById(id);

  if (!card) {
    notFound();
  }

  const categoryCards = await getCardsByCategory(card.category);
  const relatedCards = categoryCards.filter((c) => c.id !== card.id).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(card)) }}
      />
      <CardDetailContent card={card} relatedCards={relatedCards} />
    </>
  );
}
