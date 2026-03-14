import { prisma } from './prisma';
import type { SignificantDate } from '@/types/significant-date';
import type { SignificantDateFormData } from '@/lib/utils/validation';
import type { SignificantDate as PrismaSignificantDate } from '@/lib/generated/prisma';

export function computeDaysUntil(day: number, month: number): number {
  const today = new Date();
  const currentYear = today.getFullYear();

  // Build the next occurrence in the current year
  let next = new Date(currentYear, month - 1, day);

  // Strip time from today for accurate day diff
  const todayStart = new Date(currentYear, today.getMonth(), today.getDate());

  // If the date has already passed this year, use next year
  if (next < todayStart) {
    next = new Date(currentYear + 1, month - 1, day);
  }

  const diffMs = next.getTime() - todayStart.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function toSignificantDate(row: PrismaSignificantDate): SignificantDate {
  return {
    id: row.id,
    label: row.label,
    personName: row.personName,
    day: row.day,
    month: row.month,
    category: row.category,
    notes: row.notes,
    daysUntil: computeDaysUntil(row.day, row.month),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getSignificantDates(userId: string): Promise<SignificantDate[]> {
  const rows = await prisma.significantDate.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
  return rows.map(toSignificantDate).sort((a, b) => a.daysUntil - b.daysUntil);
}

export async function addSignificantDate(
  userId: string,
  data: SignificantDateFormData
): Promise<SignificantDate | undefined> {
  try {
    const row = await prisma.significantDate.create({
      data: {
        userId,
        label: data.label,
        personName: data.personName,
        day: data.day,
        month: data.month,
        category: data.category,
        notes: data.notes ?? null,
      },
    });
    return toSignificantDate(row);
  } catch {
    return undefined;
  }
}

export async function updateSignificantDate(
  userId: string,
  id: string,
  data: Partial<SignificantDateFormData>
): Promise<SignificantDate | undefined> {
  try {
    const row = await prisma.significantDate.update({
      where: { id, userId },
      data: {
        ...(data.label !== undefined && { label: data.label }),
        ...(data.personName !== undefined && { personName: data.personName }),
        ...(data.day !== undefined && { day: data.day }),
        ...(data.month !== undefined && { month: data.month }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.notes !== undefined && { notes: data.notes ?? null }),
      },
    });
    return toSignificantDate(row);
  } catch {
    return undefined;
  }
}

export async function deleteSignificantDate(userId: string, id: string): Promise<boolean> {
  try {
    await prisma.significantDate.delete({
      where: { id, userId },
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Find all significant dates where the next occurrence is in exactly `days` days.
 * Returns dates joined with user email and name for sending reminders.
 */
export async function getDatesComingUpIn(days: number): Promise<
  Array<{
    date: SignificantDate;
    userEmail: string;
    userName: string;
  }>
> {
  const rows = await prisma.significantDate.findMany({
    include: {
      user: { select: { email: true, firstName: true } },
    },
  });

  return rows
    .filter((row) => computeDaysUntil(row.day, row.month) === days)
    .map((row) => ({
      date: toSignificantDate(row),
      userEmail: row.user.email,
      userName: row.user.firstName,
    }));
}
