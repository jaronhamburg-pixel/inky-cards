import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticles } from '@/lib/db/articles';
import ArticleContent from './article-content';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getAllArticles();
  const related = allArticles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return <ArticleContent article={article} related={related} />;
}
