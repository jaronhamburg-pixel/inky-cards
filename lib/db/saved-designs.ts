import { prisma } from './prisma';
import { toCard } from './mappers';
import type { SavedDesign } from '@/types/saved-design';
import type { SavedDesign as PrismaSavedDesign, Card as PrismaCard, Prisma } from '@/lib/generated/prisma';

type JsonInput = Prisma.InputJsonValue;

function toSavedDesign(row: PrismaSavedDesign & { card: PrismaCard }): SavedDesign {
  return {
    id: row.id,
    cardId: row.cardId,
    card: toCard(row.card),
    name: row.name,
    customization: row.customization as SavedDesign['customization'],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getSavedDesignsByUserId(userId: string): Promise<SavedDesign[]> {
  const rows = await prisma.savedDesign.findMany({
    where: { userId },
    include: { card: true },
    orderBy: { updatedAt: 'desc' },
  });
  return rows.map(toSavedDesign);
}

export async function getSavedDesignById(id: string): Promise<(SavedDesign & { userId: string }) | null> {
  const row = await prisma.savedDesign.findUnique({
    where: { id },
    include: { card: true },
  });
  if (!row) return null;
  return { ...toSavedDesign(row), userId: row.userId };
}

export async function createSavedDesign(
  userId: string,
  cardId: string,
  name: string,
  customization: Record<string, unknown>,
): Promise<SavedDesign> {
  const row = await prisma.savedDesign.create({
    data: {
      userId,
      cardId,
      name,
      customization: customization as unknown as JsonInput,
    },
    include: { card: true },
  });
  return toSavedDesign(row);
}

export async function updateSavedDesign(
  id: string,
  data: { name?: string; customization?: Record<string, unknown> },
): Promise<SavedDesign | null> {
  try {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.customization !== undefined) updateData.customization = data.customization as unknown as JsonInput;

    const row = await prisma.savedDesign.update({
      where: { id },
      data: updateData,
      include: { card: true },
    });
    return toSavedDesign(row);
  } catch {
    return null;
  }
}

export async function deleteSavedDesign(id: string): Promise<boolean> {
  try {
    await prisma.savedDesign.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
