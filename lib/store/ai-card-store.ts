import { create } from 'zustand';
import { Card } from '@/types/card';

interface AiCardStore {
  card: Card | null;
  setCard: (card: Card) => void;
  clear: () => void;
}

export const useAiCardStore = create<AiCardStore>()((set) => ({
  card: null,
  setCard: (card) => set({ card }),
  clear: () => set({ card: null }),
}));
