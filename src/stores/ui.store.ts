import { create } from "zustand"

interface UiStore {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  comparePropertyIds: number[]
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  toggleSearch: () => void
  setSearchOpen: (open: boolean) => void
  addToCompare: (id: number) => void
  removeFromCompare: (id: number) => void
  clearCompare: () => void
}

const MAX_COMPARE = 4

export const useUiStore = create<UiStore>()((set, get) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  comparePropertyIds: [],

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  setMobileMenuOpen: (open) =>
    set({ isMobileMenuOpen: open }),

  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  setSearchOpen: (open) =>
    set({ isSearchOpen: open }),

  addToCompare: (id) => {
    const { comparePropertyIds } = get()
    if (comparePropertyIds.length >= MAX_COMPARE) return
    if (comparePropertyIds.includes(id)) return
    set({ comparePropertyIds: [...comparePropertyIds, id] })
  },

  removeFromCompare: (id) =>
    set((state) => ({
      comparePropertyIds: state.comparePropertyIds.filter((pid) => pid !== id),
    })),

  clearCompare: () =>
    set({ comparePropertyIds: [] }),
}))
