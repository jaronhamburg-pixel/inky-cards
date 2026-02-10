'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';
import { CartDrawer } from '@/components/cart/cart-drawer';

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-silk">
        <nav className="container-luxury">
          <div className="flex items-center justify-between h-16">
            {/* Left nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/cards"
                className="text-sm tracking-widest uppercase text-stone hover:text-ink transition-colors"
              >
                Shop Cards
              </Link>
              <Link
                href="/generate"
                className="text-sm tracking-widest uppercase text-stone hover:text-ink transition-colors"
              >
                Create with AI
              </Link>
              <Link
                href="/the-edit"
                className="text-sm tracking-widest uppercase text-stone hover:text-ink transition-colors"
              >
                The Edit
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 -ml-2"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Center logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <span className="font-serif text-2xl md:text-3xl font-semibold tracking-[0.15em] text-ink">
                INKY
              </span>
            </Link>

            {/* Right nav */}
            <div className="flex items-center gap-6">
              <Link
                href="/account"
                className="hidden md:block text-sm tracking-widest uppercase text-stone hover:text-ink transition-colors"
              >
                Account
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-1.5 text-sm tracking-widest uppercase text-stone hover:text-ink transition-colors"
                aria-label="Open shopping basket"
              >
                <span className="hidden md:inline">Basket</span>
                <svg
                  className="w-5 h-5 md:hidden"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="inline-flex items-center justify-center bg-ink text-white text-[10px] font-semibold rounded-full w-5 h-5">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="md:hidden border-t border-silk py-6 space-y-4">
              <Link
                href="/cards"
                onClick={() => setMobileOpen(false)}
                className="block text-sm tracking-widest uppercase text-stone hover:text-ink transition-colors"
              >
                Shop Cards
              </Link>
              <Link
                href="/generate"
                onClick={() => setMobileOpen(false)}
                className="block text-sm tracking-widest uppercase text-stone hover:text-ink transition-colors"
              >
                Create with AI
              </Link>
              <Link
                href="/the-edit"
                onClick={() => setMobileOpen(false)}
                className="block text-sm tracking-widest uppercase text-stone hover:text-ink transition-colors"
              >
                The Edit
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="block text-sm tracking-widest uppercase text-stone hover:text-ink transition-colors"
              >
                Account
              </Link>
            </div>
          )}
        </nav>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
