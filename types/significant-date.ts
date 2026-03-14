export interface SignificantDate {
  id: string;
  label: string;
  personName: string;
  day: number;
  month: number;
  category: string;
  notes: string | null;
  daysUntil: number;
  createdAt: Date;
  updatedAt: Date;
}

export const DATE_CATEGORIES = ['birthday', 'anniversary', 'wedding', 'holiday', 'other'] as const;
export type DateCategory = (typeof DATE_CATEGORIES)[number];
