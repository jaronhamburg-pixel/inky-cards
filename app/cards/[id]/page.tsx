'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCardById, mockCards } from '@/lib/data/mock-cards';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card3D } from '@/components/cards/card-3d';
import { formatPrice } from '@/lib/utils/formatting';
import { useCartStore } from '@/lib/store/cart-store';

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const card = getCardById(id);
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!card) {
    return (
      <div className="container-luxury py-20 text-center">
        <h1 className="heading-display text-ink mb-4">Card Not Found</h1>
        <p className="body-large text-stone mb-8">
          The card you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/cards">
          <Button>Browse All Cards</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      cardId: card.id,
      card,
      customization: {},
      quantity,
      price: card.price,
    });
    router.push('/cart');
  };

  const handleCustomize = () => {
    router.push(`/cards/${card.id}/customize`);
  };

  const relatedCards = mockCards.filter(
    (c) => c.id !== card.id && c.category === card.category
  ).slice(0, 4);

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* 3D Interactive Card */}
        <div className="flex flex-col items-center">
          <div
            className="perspective-[1200px] cursor-pointer mb-4 w-full max-w-md"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className="relative w-full aspect-[3/4]"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-lg overflow-hidden card-3d-face"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Image
                  src={card.images.front}
                  alt={card.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Back — branded */}
              <div
                className="absolute inset-0 rounded-lg overflow-hidden card-3d-face bg-paper flex flex-col items-center justify-center"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="absolute inset-0 border border-silk/60 rounded-lg m-4" />
                <span className="text-2xl md:text-3xl font-semibold tracking-widest text-ink mb-3">
                  INKY
                </span>
                <div className="w-8 h-px bg-silk mb-3" />
                <p className="text-xs uppercase tracking-[0.25em] text-stone">Designed by Inky Cards</p>
              </div>
            </motion.div>
          </div>
          <p className="text-center text-xs text-stone">Click card to flip</p>
        </div>

        {/* Card Information */}
        <div>
          <div className="mb-6">
            <Badge variant="default" className="mb-3 capitalize">
              {card.category}
            </Badge>
            <h1 className="heading-display text-ink mb-4">{card.title}</h1>
            <p className="body-large text-stone mb-6">{card.description}</p>
          </div>

          <div className="mb-8">
            <span className="text-3xl font-semibold text-ink">{formatPrice(card.price)}</span>
            <span className="text-stone ml-2 text-sm">per card</span>
          </div>

          {/* Customisation options */}
          <div className="mb-8 p-5 bg-paper border border-silk rounded-lg">
            <h3 className="text-sm font-medium text-ink mb-3 uppercase tracking-wider">Customisation</h3>
            <ul className="space-y-1.5 text-sm text-stone">
              {card.customizable.insideText && <li>Inside message personalisation</li>}
              {card.customizable.backText && <li>Back text personalisation</li>}
              <li>Font & colour selection</li>
              <li>Optional video or photo greeting with QR code</li>
            </ul>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-ink mb-2 uppercase tracking-wider">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-silk rounded hover:border-ink transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center px-3 py-2 border border-silk rounded focus:outline-none focus:ring-2 focus:ring-ink"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-silk rounded hover:border-ink transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" variant="primary" onClick={handleCustomize} className="flex-1">
              Personalise
            </Button>
            <Button size="lg" variant="outline" onClick={handleAddToCart} className="flex-1">
              Add to Basket
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-10 pt-8 border-t border-silk">
            <h3 className="text-sm font-medium text-ink mb-3 uppercase tracking-wider">Includes</h3>
            <ul className="space-y-1.5 text-sm text-stone">
              <li>Premium heavyweight cardstock</li>
              <li>Matching envelope</li>
              <li>Free personalisation</li>
              <li>Protective packaging</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Cards */}
      {relatedCards.length > 0 && (
        <div className="border-t border-silk pt-16">
          <h2 className="heading-section text-ink mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedCards.map((relatedCard) => (
              <Link
                key={relatedCard.id}
                href={`/cards/${relatedCard.id}`}
                className="group block"
              >
                <Card3D
                  frontImage={relatedCard.images.thumbnail}
                  alt={relatedCard.title}
                  hoverEffect="open"
                />
                <h3 className="text-sm font-medium text-ink tracking-tight line-clamp-1 mt-3">
                  {relatedCard.title}
                </h3>
                <p className="text-xs text-stone mt-0.5">
                  {formatPrice(relatedCard.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
