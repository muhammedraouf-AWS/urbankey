import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FavoritesStore {
  favoriteIds: number[]
  addFavorite: (id: number) => void
  removeFavorite: (id: number) => void
  toggleFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      addFavorite: (id) => {
        if (get().favoriteIds.includes(id)) return
        set((state) => ({ favoriteIds: [...state.favoriteIds, id] }))
      },

      removeFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((fid) => fid !== id),
        })),

      toggleFavorite: (id) => {
        if (get().isFavorite(id)) {
          get().removeFavorite(id)
        } else {
          get().addFavorite(id)
        }
      },

      isFavorite: (id) => get().favoriteIds.includes(id),

      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    {
      name: "urbankey-favorites",
    }
  )
)
