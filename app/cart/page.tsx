'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/formatting';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');

  const subtotal = getTotal();
  const shipping = subtotal > 50 ? 0 : 8.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    // Placeholder — no valid codes yet, always show error
    setDiscountError('Invalid discount code');
    setDiscountApplied(false);
  };

  if (items.length === 0) {
    return (
      <div className="container-luxury py-20 text-center animate-fade-in">
        <h1 className="heading-display text-ink mb-4">Your Basket is Empty</h1>
        <p className="body-large text-stone mb-8">
          Discover our collection of greeting cards
        </p>
        <Link href="/cards">
          <Button size="lg">Shop Cards</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <h1 className="heading-display text-ink mb-8 text-center">Basket</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-silk rounded-lg p-6 flex gap-6"
            >
              <div className="w-20 h-28 relative overflow-hidden rounded shadow-sm flex-shrink-0">
                <Image
                  src={item.card.images.thumbnail}
                  alt={item.card.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-ink mb-0.5">{item.card.title}</h3>
                    <p className="text-xs text-stone capitalize">{item.card.category}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-stone hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {(item.customization.frontText || item.customization.insideText) && (
                  <div className="mb-3 p-2 bg-paper border border-silk rounded text-xs">
                    {item.customization.frontText && (
                      <p className="text-stone"><span className="font-medium text-ink">Front:</span> {item.customization.frontText}</p>
                    )}
                    {item.customization.insideText && (
                      <p className="text-stone"><span className="font-medium text-ink">Inside:</span> {item.customization.insideText}</p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 border border-silk rounded hover:border-ink transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 border border-silk rounded hover:border-ink transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-ink">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-stone">{formatPrice(item.price)} each</p>
                    )}
                  </div>
                </div>

                <Link
                  href={`/cards/${item.cardId}/customize`}
                  className="inline-block mt-3 text-xs text-stone hover:text-ink transition-colors"
                >
                  Edit Personalisation &rarr;
                </Link>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-xs text-stone hover:text-red-600 transition-colors"
          >
            Clear Basket
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-silk rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-medium text-ink mb-4">Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-stone">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-stone">Free shipping on orders over £20</p>
              )}
              <div className="flex justify-between text-sm text-stone">
                <span>Tax (est.)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              {/* Discount Code */}
              <div className="pt-3 border-t border-silk">
                <label className="text-xs font-medium text-ink mb-2 block">Discount Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(''); }}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 text-xs border border-silk rounded bg-paper text-ink placeholder:text-stone/50 focus:outline-none focus:border-ink transition-colors"
                  />
                  <button
                    onClick={handleApplyDiscount}
                    className="px-4 py-2 text-xs uppercase tracking-widest border border-ink text-ink rounded hover:bg-ink hover:text-paper transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {discountError && (
                  <p className="text-xs text-red-500 mt-1">{discountError}</p>
                )}
                {discountApplied && (
                  <p className="text-xs text-green-600 mt-1">Discount applied!</p>
                )}
              </div>

              <div className="pt-3 border-t border-silk flex justify-between text-lg font-semibold text-ink">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button size="lg" variant="primary" className="w-full mb-3" onClick={() => router.push('/checkout')}>
              Checkout
            </Button>
            <Link href="/cards">
              <Button size="lg" variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>

            <div className="mt-6 pt-6 border-t border-silk space-y-2 text-xs text-stone">
              <p>Secure checkout</p>
              <p>Free returns within 30 days</p>
              <p>Premium quality guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
