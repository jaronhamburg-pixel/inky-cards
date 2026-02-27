'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from '@/types/card';
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
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden card-3d-face">
              <Image
                src={card.images.thumbnail}
                alt={card.title}
                fill
                className="object-cover transition-opacity duration-500 group-hover:opacity-0"
              />
              <Image
                src={card.images.back}
                alt={`${card.title} — inside`}
                fill
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>
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
