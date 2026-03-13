import type { MetadataRoute } from 'next';
import { getAllCards } from '@/lib/db/cards';
import { getAllArticles } from '@/lib/db/articles';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://inkycards.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cards = await getAllCards();
  const articles = await getAllArticles();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/cards`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/the-edit`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/generate`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const cardPages: MetadataRoute.Sitemap = cards.map((card) => ({
    url: `${BASE_URL}/cards/${card.id}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/the-edit/${article.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...cardPages, ...articlePages];
}
