'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { mockCards } from '@/lib/data/mock-cards';
import { formatPrice } from '@/lib/utils/formatting';

const featuredCards = mockCards.slice(0, 10);

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % featuredCards.length);
  }, []);

  // Auto-rotate every 3 seconds
  useEffect(() => {
    const timer = setInterval(nextCard, 3000);
    return () => clearInterval(timer);
  }, [nextCard]);

  return (
    <div>
      {/* Hero + Carousel Section — compact so cards are visible on landing */}
      <section className="pt-14 pb-8 md:pt-20 md:pb-12">
        <div className="container-luxury text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="heading-hero text-ink mb-4"
          >
            Cards worth keeping.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="body-large text-stone max-w-xl mx-auto mb-8"
          >
            Personalised greeting cards crafted with care. AI-powered design,
            video messages, and premium quality printing.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/cards">
              <Button size="lg" variant="primary">
                Shop Cards
              </Button>
            </Link>
            <Link href="/generate">
              <Button size="lg" variant="outline">
                AI Designer
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* The Collection — auto-rotating carousel */}
      <section className="pb-20 md:pb-28">
        <div className="container-luxury">
          <div className="text-center mb-10">
            <h2 className="heading-display text-ink mb-2">The Collection</h2>
            <p className="text-stone text-base">Curated designs for every occasion</p>
          </div>

          {/* Carousel — shows all 10 cards with active card highlighted */}
          <div className="relative">
            <div className="flex items-end justify-center gap-3 md:gap-5 overflow-hidden py-4">
              {featuredCards.map((card, i) => {
                const offset = i - activeIndex;
                const isActive = i === activeIndex;
                // Calculate distance for scaling (wrapping around)
                const dist = Math.min(
                  Math.abs(offset),
                  Math.abs(offset + featuredCards.length),
                  Math.abs(offset - featuredCards.length)
                );
                const visible = dist <= 3;

                if (!visible) return null;

                return (
                  <motion.div
                    key={card.id}
                    layout
                    initial={false}
                    animate={{
                      scale: isActive ? 1 : 0.78 - dist * 0.06,
                      opacity: isActive ? 1 : 0.6 - dist * 0.12,
                      zIndex: isActive ? 10 : 5 - dist,
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => setActiveIndex(i)}
                  >
                    <Link
                      href={`/cards/${card.id}`}
                      className="block"
                      onClick={(e) => {
                        if (!isActive) {
                          e.preventDefault();
                          setActiveIndex(i);
                        }
                      }}
                    >
                      <div
                        className={`relative overflow-hidden rounded-lg card-3d-face transition-shadow duration-500 ${
                          isActive
                            ? 'w-44 md:w-56 aspect-[3/4] shadow-xl'
                            : 'w-32 md:w-40 aspect-[3/4] shadow-md'
                        }`}
                      >
                        <Image
                          src={card.images.thumbnail}
                          alt={card.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Active card info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-center mt-6"
              >
                <h3 className="font-serif text-lg font-medium text-ink tracking-tight">
                  {featuredCards[activeIndex].title}
                </h3>
                <p className="text-sm text-stone mt-0.5">
                  {formatPrice(featuredCards[activeIndex].price)}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-5">
              {featuredCards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-6 h-1.5 bg-ink'
                      : 'w-1.5 h-1.5 bg-stone/30 hover:bg-stone/50'
                  }`}
                  aria-label={`View card ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/cards">
              <Button size="lg" variant="outline">
                View All Cards
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-silk">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-serif text-xl font-medium text-ink mb-3 tracking-tight">
                AI-Powered Design
              </h3>
              <p className="text-stone text-sm leading-relaxed">
                Describe your vision and our AI creates a unique card tailored
                to your occasion, tone, and style. Every card is one of a kind.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="font-serif text-xl font-medium text-ink mb-3 tracking-tight">
                Video Greetings
              </h3>
              <p className="text-stone text-sm leading-relaxed">
                Record a personal video message. We generate a QR code printed
                inside your card so the recipient can watch it instantly.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-serif text-xl font-medium text-ink mb-3 tracking-tight">
                Premium Quality
              </h3>
              <p className="text-stone text-sm leading-relaxed">
                Printed on heavyweight textured stock with luxury finishes.
                Matched envelopes included. Shipped in protective packaging.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Editorial CTA */}
      <section className="bg-ink text-paper py-24 md:py-32">
        <div className="container-luxury text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-display text-paper mb-6"
          >
            Make it personal.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="body-large text-paper/60 mb-12 max-w-lg mx-auto"
          >
            Whether you choose from our collection or create with AI, every card
            tells your story.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/generate">
              <Button size="lg" variant="outline" className="border-paper text-paper hover:bg-paper hover:text-ink">
                Start with AI
              </Button>
            </Link>
            <Link href="/cards">
              <Button size="lg" variant="outline" className="border-paper/30 text-paper/60 hover:bg-paper hover:text-ink">
                Browse Collection
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
