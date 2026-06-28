import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, AuthTokens } from "@/types/auth"

interface AuthStore {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  signOut: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: user !== null }),

      setTokens: (tokens) =>
        set({ tokens }),

      signOut: () =>
        set({ user: null, tokens: null, isAuthenticated: false }),
    }),
    {
      name: "urbankey-auth",
      partialize: (state) => ({ tokens: state.tokens }),
    }
  )
)
