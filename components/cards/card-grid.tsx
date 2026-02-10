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
        <h3 className="font-serif text-xl text-ink mb-2">No cards found</h3>
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
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-silk mb-3 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
              <Image
                src={card.images.thumbnail}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-300" />
            </div>
            <h3 className="font-serif text-sm font-medium text-ink tracking-tight line-clamp-1">
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
