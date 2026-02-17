'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/types/card';
import { Card3D } from '@/components/cards/card-3d';
import { formatPrice } from '@/lib/utils/formatting';

interface CardGridProps {
  cards: Card[];
}

export function CardGrid({ cards }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="col-span-full text-center py-20">
        <h3 className="text-xl text-ink mb-2">No cards found</h3>
        <p className="text-stone text-sm">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <>
      {cards.map((card, i) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
        >
          <Link
            href={`/cards/${card.id}`}
            className="group block"
          >
            <Card3D
              frontImage={card.images.thumbnail}
              alt={card.title}
              hoverEffect="open"
            />
            <h3 className="text-sm font-medium text-ink tracking-tight line-clamp-1 mt-3">
              {card.title}
            </h3>
            <p className="text-xs text-stone mt-0.5">
              {formatPrice(card.price)}
            </p>
          </Link>
        </motion.div>
      ))}
    </>
  );
}
