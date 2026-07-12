import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SearchStore {
  recentSearches: string[]
  addRecentSearch: (query: string) => void
  removeRecentSearch: (query: string) => void
  clearRecentSearches: () => void
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      recentSearches: [],

      addRecentSearch: (query) => {
        const q = query.trim()
        if (!q) return
        set((state) => ({
          recentSearches: [q, ...state.recentSearches.filter((s) => s !== q)].slice(0, 5),
        }))
      },

      removeRecentSearch: (query) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== query),
        })),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: "urbankey-recent-searches" }
  )
)
