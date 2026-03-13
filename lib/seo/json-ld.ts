import type { Card } from '@/types/card';
import type { Article } from '@/lib/db/articles';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://inkycards.com';

export function productJsonLd(card: Card) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: card.title,
    description: card.description,
    image: card.images.front,
    offers: {
      '@type': 'Offer',
      price: card.price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/cards/${card.id}`,
    },
  };
}

export function articleJsonLd(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    publisher: {
      '@type': 'Organization',
      name: 'Inky Cards',
      url: BASE_URL,
    },
  };
}
