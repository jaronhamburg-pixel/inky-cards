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
      {/* Full-bleed hero with featured article overlay */}
      <section className="relative">
        <Link href={`/the-edit/${featured.slug}`} className="group block">
          <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <span className="text-xs uppercase tracking-widest text-white/60 mb-3 block">
                    {featured.category}
                  </span>
                  <h1 className="text-2xl md:text-4xl font-medium text-white tracking-tight leading-tight mb-4">
                    {featured.title}
                  </h1>
                  <p className="text-white/70 text-lg leading-relaxed max-w-xl mb-4">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <time>{new Date(featured.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span>{featured.readTime}</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Article grid */}
      <section className="py-20">
        <div className="container-luxury">
          <h2 className="heading-display text-ink mb-14 text-center">Latest Articles</h2>
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
                  <h3 className="text-base font-medium text-ink mt-2 mb-2 tracking-tight leading-snug group-hover:underline decoration-1 underline-offset-4">
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
                Inky AI Designer
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
