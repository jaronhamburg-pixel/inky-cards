'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { mockCards } from '@/lib/data/mock-cards';
import { formatPrice } from '@/lib/utils/formatting';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function Home() {
  const featuredCards = mockCards.slice(0, 8);

  return (
    <div>
      {/* Hero Section — Editorial, minimal */}
      <section className="py-24 md:py-36">
        <div className="container-luxury text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="heading-hero text-ink mb-8"
          >
            Cards worth keeping.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="body-large text-stone max-w-xl mx-auto mb-12"
          >
            Personalised greeting cards crafted with care. AI-powered design,
            video messages, and premium quality printing.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/cards">
              <Button size="lg" variant="primary">
                Shop Cards
              </Button>
            </Link>
            <Link href="/generate">
              <Button size="lg" variant="outline">
                Create with AI
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Cards Grid — visible early */}
      <section className="pb-24">
        <div className="container-luxury">
          <div className="text-center mb-14">
            <h2 className="heading-display text-ink mb-3">The Collection</h2>
            <p className="text-stone text-base">Curated designs for every occasion</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredCards.map((card, i) => (
              <motion.div
                key={card.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeIn}
              >
                <Link
                  href={`/cards/${card.id}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-silk mb-3 shadow-sm">
                    <Image
                      src={card.images.thumbnail}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-300" />
                  </div>
                  <h3 className="font-serif text-base font-medium text-ink tracking-tight line-clamp-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-stone mt-0.5">
                    {formatPrice(card.price)}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/cards">
              <Button size="lg" variant="outline">
                View All Cards
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features — minimal, text-based, no icons/emojis */}
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

      {/* Editorial CTA — full-width, black bg */}
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
