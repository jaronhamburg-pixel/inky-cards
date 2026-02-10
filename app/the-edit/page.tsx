'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { mockArticles } from '@/lib/data/mock-articles';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function TheEditPage() {
  const featured = mockArticles[0];
  const rest = mockArticles.slice(1);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container-luxury text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="heading-hero text-ink mb-4"
          >
            The Edit
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="body-large text-stone max-w-lg mx-auto"
          >
            Ideas, inspiration, and the stories behind considered card-giving.
          </motion.p>
        </div>
      </section>

      {/* Featured article — large hero card */}
      <section className="pb-20">
        <div className="container-luxury">
          <Link href={`/the-edit/${featured.slug}`} className="group block">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              <div className="aspect-[16/10] relative overflow-hidden rounded-lg bg-silk">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="md:pl-4">
                <span className="text-xs uppercase tracking-widest text-stone">
                  {featured.category}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-ink mt-3 mb-4 tracking-tight leading-tight group-hover:underline decoration-1 underline-offset-4">
                  {featured.title}
                </h2>
                <p className="text-stone leading-relaxed mb-4">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-stone/60">
                  <time>{new Date(featured.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                  <span className="w-1 h-1 rounded-full bg-stone/30" />
                  <span>{featured.readTime}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="container-luxury">
        <div className="border-t border-silk" />
      </div>

      {/* Article grid */}
      <section className="py-20">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {rest.map((article, i) => (
              <motion.div
                key={article.slug}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeIn}
              >
                <Link href={`/the-edit/${article.slug}`} className="group block">
                  <div className="aspect-[16/10] relative overflow-hidden rounded-lg bg-silk mb-5">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-stone">
                    {article.category}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-ink mt-2 mb-2 tracking-tight leading-snug group-hover:underline decoration-1 underline-offset-4">
                    {article.title}
                  </h3>
                  <p className="text-sm text-stone leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-stone/60 mt-3">
                    <time>{new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                    <span className="w-1 h-1 rounded-full bg-stone/30" />
                    <span>{article.readTime}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-paper py-20 md:py-28">
        <div className="container-luxury text-center">
          <h2 className="heading-display text-paper mb-4">
            Ready to send something meaningful?
          </h2>
          <p className="body-large text-paper/60 mb-10 max-w-md mx-auto">
            Browse our curated collection or create something entirely your own.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cards">
              <button className="px-8 py-3 text-sm uppercase tracking-widest border border-paper text-paper rounded hover:bg-paper hover:text-ink transition-colors">
                Shop Cards
              </button>
            </Link>
            <Link href="/generate">
              <button className="px-8 py-3 text-sm uppercase tracking-widest border border-paper/30 text-paper/60 rounded hover:bg-paper hover:text-ink transition-colors">
                Create with AI
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
