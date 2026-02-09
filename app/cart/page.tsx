'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/formatting';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  const subtotal = getTotal();
  const shipping = subtotal > 50 ? 0 : 8.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container-luxury py-20 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 rounded-full mb-6">
          <svg
            className="w-10 h-10 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h1 className="heading-display text-luxury-charcoal mb-4">Your Cart is Empty</h1>
        <p className="body-large text-neutral-600 mb-8">
          Discover our collection of luxury greeting cards
        </p>
        <Link href="/cards">
          <Button size="lg">Browse Cards</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <h1 className="heading-display text-luxury-charcoal mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200 rounded-lg p-6 flex gap-6"
            >
              {/* Card Image */}
              <div className="w-24 h-32 relative overflow-hidden rounded-md flex-shrink-0">
                <Image
                  src={item.card.images.thumbnail}
                  alt={item.card.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Card Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-luxury-charcoal mb-1">
                      {item.card.title}
                    </h3>
                    <p className="text-sm text-neutral-500 capitalize">{item.card.category}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-neutral-400 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Customization */}
                {(item.customization.frontText || item.customization.insideText) && (
                  <div className="mb-3 p-2 bg-luxury-cream rounded text-xs">
                    {item.customization.frontText && (
                      <p className="text-neutral-700">
                        <span className="font-medium">Front:</span> {item.customization.frontText}
                      </p>
                    )}
                    {item.customization.insideText && (
                      <p className="text-neutral-700">
                        <span className="font-medium">Inside:</span>{' '}
                        {item.customization.insideText}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 border border-neutral-300 rounded hover:border-luxury-gold transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 border border-neutral-300 rounded hover:border-luxury-gold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-luxury-gold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-neutral-500">
                        {formatPrice(item.price)} each
                      </p>
                    )}
                  </div>
                </div>

                {/* Edit button */}
                <Link
                  href={`/cards/${item.cardId}/customize`}
                  className="inline-block mt-3 text-sm text-luxury-gold hover:text-luxury-dark-gold transition-colors"
                >
                  Edit Customization →
                </Link>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 sticky top-24">
            <h2 className="font-semibold text-lg text-luxury-charcoal mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-neutral-500">
                  Free shipping on orders over $50
                </p>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Tax (estimated)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between text-lg font-semibold text-luxury-charcoal">
                <span>Total</span>
                <span className="text-luxury-gold">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              size="lg"
              variant="secondary"
              className="w-full mb-3"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </Button>

            <Link href="/cards">
              <Button size="lg" variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Premium quality guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
