import { prisma } from './prisma';
import type { Card } from '@/types/card';
import type { Card as PrismaCard, Prisma } from '@/lib/generated/prisma';

type JsonInput = Prisma.InputJsonValue;

function toCard(row: PrismaCard): Card {
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

export async function getAllCards(): Promise<Card[]> {
  const rows = await prisma.card.findMany({ orderBy: { id: 'asc' } });
  return rows.map(toCard);
}

export async function getCardById(id: string): Promise<Card | undefined> {
  const row = await prisma.card.findUnique({ where: { id } });
  return row ? toCard(row) : undefined;
}

export async function getCardsByCategory(category: string): Promise<Card[]> {
  const rows = await prisma.card.findMany({ where: { category } });
  return rows.map(toCard);
}

export async function searchCards(query: string): Promise<Card[]> {
  const lowerQuery = query.toLowerCase();
  const rows = await prisma.card.findMany({
    where: {
      OR: [
        { title: { contains: lowerQuery, mode: 'insensitive' } },
        { description: { contains: lowerQuery, mode: 'insensitive' } },
        { category: { contains: lowerQuery, mode: 'insensitive' } },
      ],
    },
  });
  return rows.map(toCard);
}

export async function addCard(card: Omit<Card, 'id'>): Promise<Card> {
  const row = await prisma.card.create({
    data: {
      title: card.title,
      description: card.description,
      category: card.category,
      price: card.price,
      images: card.images as unknown as JsonInput,
      customizable: card.customizable as unknown as JsonInput,
      templates: card.templates as unknown as JsonInput,
    },
  });
  return toCard(row);
}

export async function updateCard(id: string, updates: Partial<Omit<Card, 'id'>>): Promise<Card | undefined> {
  try {
    const data: Record<string, unknown> = {};
    if (updates.title !== undefined) data.title = updates.title;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.category !== undefined) data.category = updates.category;
    if (updates.price !== undefined) data.price = updates.price;
    if (updates.images !== undefined) data.images = updates.images as unknown as JsonInput;
    if (updates.customizable !== undefined) data.customizable = updates.customizable as unknown as JsonInput;
    if (updates.templates !== undefined) data.templates = updates.templates as unknown as JsonInput;

    const row = await prisma.card.update({ where: { id }, data });
    return toCard(row);
  } catch {
    return undefined;
  }
}

export async function deleteCard(id: string): Promise<boolean> {
  try {
    await prisma.card.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
