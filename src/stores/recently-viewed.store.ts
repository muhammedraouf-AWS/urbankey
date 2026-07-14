import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RecentlyViewedStore {
  propertyIds: number[]
  addRecentlyViewed: (id: number) => void
  clearRecentlyViewed: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      propertyIds: [],

      addRecentlyViewed: (id) =>
        set((state) => ({
          propertyIds: [id, ...state.propertyIds.filter((i) => i !== id)].slice(0, 20),
        })),

      clearRecentlyViewed: () => set({ propertyIds: [] }),
    }),
    { name: "urbankey-recently-viewed" }
  )
)
