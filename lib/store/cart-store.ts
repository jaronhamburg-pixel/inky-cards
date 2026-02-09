import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderItem } from '@/types/order';
import { nanoid } from 'nanoid';

interface CartStore {
  items: OrderItem[];
  addItem: (item: Omit<OrderItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateCustomization: (itemId: string, customization: OrderItem['customization']) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const newItem: OrderItem = {
          ...item,
          id: nanoid(),
        };
        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      updateCustomization: (itemId, customization) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, customization } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'inky-cards-cart',
    }
  )
);
