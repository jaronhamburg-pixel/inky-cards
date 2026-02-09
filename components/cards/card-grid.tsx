import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/types/card';
import { formatPrice } from '@/lib/utils/formatting';
import { Badge } from '@/components/ui/badge';

interface CardGridProps {
  cards: Card[];
}

export function CardGrid({ cards }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="heading-card text-neutral-600 mb-2">No cards found</h3>
        <p className="text-neutral-500">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <>
      {cards.map((card) => (
        <Link
          key={card.id}
          href={`/cards/${card.id}`}
          className="group bg-white rounded-lg overflow-hidden border border-neutral-200 hover:border-luxury-gold hover:shadow-lg transition-all duration-300"
        >
          <div className="aspect-[3/4] relative overflow-hidden bg-neutral-100">
            <Image
              src={card.images.thumbnail}
              alt={card.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-luxury-charcoal group-hover:text-luxury-gold transition-colors line-clamp-1">
                {card.title}
              </h3>
              <Badge variant="default" className="ml-2 capitalize text-xs">
                {card.category}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{card.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-luxury-gold">
                {formatPrice(card.price)}
              </span>
              <span className="text-xs text-neutral-500 capitalize">
                {card.occasions[0].replace('-', ' ')}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
