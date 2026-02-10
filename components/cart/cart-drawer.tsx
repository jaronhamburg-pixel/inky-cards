'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/formatting';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const itemCount = getItemCount();
  const subtotal = getTotal();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping basket"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-silk px-6 py-4">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-medium text-ink">Basket</h2>
            {itemCount > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-stone transition-colors hover:text-ink"
            aria-label="Close basket"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <p className="text-ink font-serif font-medium mb-1">Your basket is empty</p>
            <p className="text-sm text-stone mb-6">Add some beautiful cards to get started.</p>
            <Link href="/cards" onClick={onClose}>
              <Button variant="primary" size="md">Shop Cards</Button>
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="divide-y divide-silk">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded shadow-sm">
                    <Image
                      src={item.card.images.thumbnail}
                      alt={item.card.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-ink">{item.card.title}</h3>
                        {(item.customization.frontText || item.customization.insideText) && (
                          <p className="mt-0.5 text-xs text-stone line-clamp-1">
                            {item.customization.frontText || item.customization.insideText}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 text-stone transition-colors hover:text-red-500"
                        aria-label={`Remove ${item.card.title}`}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-0 rounded border border-silk">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-ink transition-colors hover:bg-neutral-100"
                          aria-label="Decrease quantity"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="flex h-7 w-8 items-center justify-center border-x border-silk text-xs font-medium text-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-ink transition-colors hover:bg-neutral-100"
                          aria-label="Increase quantity"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-sm font-medium text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t border-silk px-6 py-4">
            <div className="flex items-center justify-between pb-4">
              <span className="text-sm font-medium text-ink">Subtotal</span>
              <span className="text-lg font-serif font-semibold text-ink">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="pb-4 text-xs text-stone">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/checkout" onClick={onClose}>
                <Button variant="primary" size="lg" className="w-full">
                  Checkout
                </Button>
              </Link>
              <Link href="/cart" onClick={onClose}>
                <Button variant="outline" size="lg" className="w-full">
                  View Basket
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
