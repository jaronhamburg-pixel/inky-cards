import type { Card } from '@/types/card';
import type { Card as PrismaCard } from '@/lib/generated/prisma';

export function toCard(row: PrismaCard): Card {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as Card['category'],
    price: row.price,
    images: row.images as Card['images'],
    customizable: row.customizable as Card['customizable'],
    templates: row.templates as Card['templates'],
  };
}
