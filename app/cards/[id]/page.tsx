'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCardById, mockCards } from '@/lib/data/mock-cards';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils/formatting';
import { useCartStore } from '@/lib/store/cart-store';
import { useState } from 'react';

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const card = getCardById(id);
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState<'front' | 'back'>('front');

  if (!card) {
    return (
      <div className="container-luxury py-20 text-center">
        <h1 className="heading-display text-luxury-charcoal mb-4">Card Not Found</h1>
        <p className="body-large text-neutral-600 mb-8">
          The card you're looking for doesn't exist.
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
    (c) => c.id !== card.id && (c.category === card.category || c.occasions.some((occ) => card.occasions.includes(occ)))
  ).slice(0, 3);

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div>
          <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-neutral-100 mb-4">
            <Image
              src={currentImage === 'front' ? card.images.front : card.images.back}
              alt={card.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentImage('front')}
              className={`aspect-[3/4] relative overflow-hidden rounded-lg border-2 transition-all ${
                currentImage === 'front' ? 'border-luxury-gold' : 'border-neutral-200'
              }`}
            >
              <Image src={card.images.front} alt="Front" fill className="object-cover" />
            </button>
            <button
              onClick={() => setCurrentImage('back')}
              className={`aspect-[3/4] relative overflow-hidden rounded-lg border-2 transition-all ${
                currentImage === 'back' ? 'border-luxury-gold' : 'border-neutral-200'
              }`}
            >
              <Image src={card.images.back} alt="Back" fill className="object-cover" />
            </button>
          </div>
        </div>

        {/* Card Information */}
        <div>
          <div className="mb-4">
            <Badge variant="default" className="mb-3 capitalize">
              {card.category}
            </Badge>
            <h1 className="heading-display text-luxury-charcoal mb-4">{card.title}</h1>
            <p className="body-large text-neutral-600 mb-6">{card.description}</p>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-luxury-gold">{formatPrice(card.price)}</span>
            <span className="text-neutral-500 ml-2">per card</span>
          </div>

          {/* Occasions */}
          <div className="mb-6">
            <h3 className="font-semibold text-luxury-charcoal mb-2">Perfect For:</h3>
            <div className="flex flex-wrap gap-2">
              {card.occasions.map((occasion) => (
                <Badge key={occasion} variant="info" className="capitalize">
                  {occasion.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          {/* Customization Options */}
          <div className="mb-8 p-4 bg-luxury-cream rounded-lg">
            <h3 className="font-semibold text-luxury-charcoal mb-2">Customization Options:</h3>
            <ul className="space-y-1 text-sm text-neutral-700">
              {card.customizable.frontText && <li>✓ Front text customization</li>}
              {card.customizable.insideText && <li>✓ Inside text customization</li>}
              {card.customizable.backText && <li>✓ Back text customization</li>}
              <li>✓ Font selection</li>
              <li>✓ Optional video greeting with QR code</li>
            </ul>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block font-semibold text-luxury-charcoal mb-2">Quantity:</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-neutral-300 rounded-md hover:border-luxury-gold transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-neutral-300 rounded-md hover:border-luxury-gold transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="secondary" onClick={handleCustomize} className="flex-1">
              Customize This Card
            </Button>
            <Button size="lg" variant="primary" onClick={handleAddToCart} className="flex-1">
              Add to Cart
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <h3 className="font-semibold text-luxury-charcoal mb-4">What's Included:</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>• Premium cardstock with luxury finish</li>
              <li>• Matching envelope</li>
              <li>• Free personalization</li>
              <li>• Optional video greeting with QR code</li>
              <li>• Shipped in protective packaging</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Cards */}
      {relatedCards.length > 0 && (
        <div className="border-t border-neutral-200 pt-16">
          <h2 className="heading-section text-luxury-charcoal mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCards.map((relatedCard) => (
              <Link
                key={relatedCard.id}
                href={`/cards/${relatedCard.id}`}
                className="group bg-white rounded-lg overflow-hidden border border-neutral-200 hover:border-luxury-gold hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-neutral-100">
                  <Image
                    src={relatedCard.images.thumbnail}
                    alt={relatedCard.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-luxury-charcoal group-hover:text-luxury-gold transition-colors line-clamp-1 mb-2">
                    {relatedCard.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-luxury-gold">
                      {formatPrice(relatedCard.price)}
                    </span>
                    <Badge variant="default" className="capitalize text-xs">
                      {relatedCard.category}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
