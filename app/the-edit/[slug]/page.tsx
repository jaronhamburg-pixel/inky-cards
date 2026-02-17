'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getArticleBySlug, mockArticles } from '@/lib/data/mock-articles';
import { Button } from '@/components/ui/button';

export default function ArticlePage() {
  const params = useParams();
  const article = getArticleBySlug(params.slug as string);

  if (!article) {
    return (
      <div className="container-luxury py-32 text-center">
        <h1 className="heading-display text-ink mb-4">Article Not Found</h1>
        <p className="body-large text-stone mb-8">
          This article doesn&apos;t exist or has been moved.
        </p>
        <Link href="/the-edit">
          <Button variant="primary" size="lg">Back to The Edit</Button>
        </Link>
      </div>
    );
  }

  const related = mockArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Article header */}
      <section className="pt-16 pb-10">
        <div className="container-luxury max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/the-edit"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone hover:text-ink transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              The Edit
            </Link>
            <span className="block text-xs uppercase tracking-widest text-stone mb-4">
              {article.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-medium text-ink tracking-tight leading-tight mb-6">
              {article.title}
            </h1>
            <p className="text-sm text-stone mb-6">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 text-sm text-stone/60 pb-8 border-b border-silk">
              <time>
                {new Date(article.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <span className="w-1 h-1 rounded-full bg-stone/30" />
              <span>{article.readTime}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero image */}
      <section className="pb-12">
        <div className="container-luxury max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="aspect-[16/9] relative overflow-hidden rounded-lg bg-silk"
          >
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Article body */}
      <section className="pb-20">
        <div className="container-luxury max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {article.content.map((paragraph, i) => (
              <p key={i} className="text-ink/80 leading-[1.75] text-[13px]">
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Related articles */}
      <section className="py-20 border-t border-silk">
        <div className="container-luxury">
          <h2 className="heading-display text-ink text-center mb-14">
            Continue Reading
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/the-edit/${item.slug}`}
                className="group block"
              >
                <div className="aspect-[16/10] relative overflow-hidden rounded-lg bg-silk mb-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-xs uppercase tracking-widest text-stone">
                  {item.category}
                </span>
                <h3 className="text-sm font-medium text-ink mt-1.5 tracking-tight leading-snug group-hover:underline decoration-1 underline-offset-4">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
