import { getAllArticles } from '@/lib/db/articles';
import TheEditContent from './the-edit-content';

export default async function TheEditPage() {
  const articles = await getAllArticles();
  return <TheEditContent articles={articles} />;
}
