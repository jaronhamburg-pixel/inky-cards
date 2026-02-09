'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';
import { CartDrawer } from '@/components/cart/cart-drawer';

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <nav className="container-luxury py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="heading-card text-luxury-charcoal">Inky Cards</span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/cards"
                className="body-regular text-neutral-700 hover:text-luxury-gold transition-colors"
              >
                Browse Cards
              </Link>
              <Link
                href="/generate"
                className="body-regular text-neutral-700 hover:text-luxury-gold transition-colors"
              >
                AI Generator
              </Link>
              <Link
                href="/about"
                className="body-regular text-neutral-700 hover:text-luxury-gold transition-colors"
              >
                About
              </Link>
            </div>

            {/* Cart Icon */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative"
              aria-label="Open shopping cart"
            >
              <svg
                className="w-6 h-6 text-luxury-charcoal hover:text-luxury-gold transition-colors"
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
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-charcoal text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-around mt-4 pt-4 border-t border-neutral-200">
            <Link
              href="/cards"
              className="text-sm text-neutral-700 hover:text-luxury-gold transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/generate"
              className="text-sm text-neutral-700 hover:text-luxury-gold transition-colors"
            >
              AI Generator
            </Link>
            <Link
              href="/about"
              className="text-sm text-neutral-700 hover:text-luxury-gold transition-colors"
            >
              About
            </Link>
          </div>
        </nav>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
