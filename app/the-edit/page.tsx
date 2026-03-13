import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/db/articles';
import TheEditContent from './the-edit-content';

export const metadata: Metadata = {
  title: 'The Edit',
  description: 'Inspiration, guides, and stories from the world of greeting cards.',
};

export default async function TheEditPage() {
  const articles = await getAllArticles();
  return <TheEditContent articles={articles} />;
}
