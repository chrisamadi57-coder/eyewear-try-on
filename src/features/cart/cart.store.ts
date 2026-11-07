"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
type CartLine = { productId: string; variantId: string; qty: number };
type CartState = {
  items: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (productId: string, variantId: string) => void;
  remove: (productId: string, variantId: string) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  clear: () => void;
};
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      add: (productId, variantId) =>
        set((state) => {
          const found = state.items.find(
            (item) =>
              item.productId === productId && item.variantId === variantId,
          );
          return {
            items: found
              ? state.items.map((item) =>
                  item === found ? { ...item, qty: item.qty + 1 } : item,
                )
              : [...state.items, { productId, variantId, qty: 1 }],
          };
        }),
      remove: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              item.productId !== productId || item.variantId !== variantId,
          ),
        })),
      setQty: (productId, variantId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter(
                  (item) =>
                    item.productId !== productId ||
                    item.variantId !== variantId,
                )
              : state.items.map((item) =>
                  item.productId === productId && item.variantId === variantId
                    ? { ...item, qty }
                    : item,
                ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "atelier-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }) as CartState,
    },
  ),
);
