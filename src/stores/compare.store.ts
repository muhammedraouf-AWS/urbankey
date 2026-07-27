import { create } from "zustand"
import { persist } from "zustand/middleware"

export const MAX_COMPARE = 4

interface CompareStore {
  compareIds: number[]
  addToCompare: (id: number) => void
  removeFromCompare: (id: number) => void
  toggleCompare: (id: number) => void
  isInCompare: (id: number) => boolean
  clearCompare: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      compareIds: [],

      addToCompare: (id) => {
        if (get().compareIds.includes(id)) return
        if (get().compareIds.length >= MAX_COMPARE) return
        set((state) => ({ compareIds: [...state.compareIds, id] }))
      },

      removeFromCompare: (id) =>
        set((state) => ({
          compareIds: state.compareIds.filter((cid) => cid !== id),
        })),

      toggleCompare: (id) => {
        if (get().isInCompare(id)) {
          get().removeFromCompare(id)
        } else {
          get().addToCompare(id)
        }
      },

      isInCompare: (id) => get().compareIds.includes(id),

      clearCompare: () => set({ compareIds: [] }),
    }),
    {
      name: "urbankey-compare",
    }
  )
)
