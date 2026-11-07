"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type FavoritesState = { ids: string[]; toggle: (id: string) => void };
export const useFavorites = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((item) => item !== id)
            : [...state.ids, id],
        })),
    }),
    {
      name: "atelier-favorites",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
