import { prisma } from './prisma';
import type { Article as PrismaArticle } from '@/lib/generated/prisma';

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
}

function toArticle(row: PrismaArticle): Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.date,
    readTime: row.readTime,
    image: row.image,
    content: row.content,
  };
}

export async function getAllArticles(): Promise<Article[]> {
  const rows = await prisma.article.findMany({ orderBy: { date: 'desc' } });
  return rows.map(toArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const row = await prisma.article.findUnique({ where: { slug } });
  return row ? toArticle(row) : undefined;
}
