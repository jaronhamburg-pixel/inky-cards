'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { mockCards } from '@/lib/data/mock-cards';
import { formatPrice } from '@/lib/utils/formatting';

const featuredCards = mockCards.slice(0, 10);

export default function Home() {

  return (
    <div>
      {/* Hero + Carousel Section — compact so cards are visible on landing */}
      <section className="pt-4 pb-4 md:pt-8 md:pb-6">
        <div className="container-luxury text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="heading-hero text-ink mb-4"
          >
            Make Every Greeting Unforgettable
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="body-large text-stone max-w-xl mx-auto mb-6"
          >
            Personalised greeting cards crafted with care.<br />
            AI-powered design, video messages, and premium quality printing.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/cards">
              <Button size="lg" variant="primary" className="min-w-[200px]">
                Shop Cards
              </Button>
            </Link>
            <Link href="/generate">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                Inky AI Designer
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* The Collection — carousel with hover pop */}
      <section className="pb-16 md:pb-24">
        <div className="container-luxury">
          <div className="text-center mb-8">
            <h2 className="heading-section text-ink mb-2">The Collection</h2>
            <p className="body-large text-stone">Curated designs for every occasion</p>
          </div>

          <div className="flex items-center justify-center gap-3 md:gap-5 overflow-x-auto py-6 px-4 scrollbar-hide">
            {featuredCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, delay: i * 0.05 }}
                whileHover={{ scale: 1.08, y: -10, zIndex: 20, transition: { duration: 0.1 } }}
                className="flex-shrink-0 relative z-0"
              >
                <Link href={`/cards/${card.id}`} className="block group">
                  <div className="w-36 md:w-44 aspect-[3/4] relative overflow-hidden rounded-lg card-3d-face shadow-md transition-shadow duration-300 hover:shadow-xl">
                    <Image
                      src={card.images.thumbnail}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium text-ink truncate">{card.title}</p>
                    <p className="text-xs text-stone">{formatPrice(card.price)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
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
              <h3 className="text-xl font-medium text-ink mb-3 tracking-tight">
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
              <h3 className="text-xl font-medium text-ink mb-3 tracking-tight">
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
              <h3 className="text-xl font-medium text-ink mb-3 tracking-tight">
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
              <Button size="lg" variant="outline" className="border-paper text-paper hover:bg-paper hover:text-ink min-w-[200px]">
                Inky AI Designer
              </Button>
            </Link>
            <Link href="/cards">
              <Button size="lg" variant="outline" className="border-paper/30 text-paper/60 hover:bg-paper hover:text-ink min-w-[200px]">
                View All Cards
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
