import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, AuthTokens } from "@/types/auth"

const AUTH_COOKIE = "__uk_auth"
const COOKIE_TTL  = 7 * 24 * 60 * 60 // 7 days in seconds

function setAuthCookie() {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${COOKIE_TTL}; SameSite=Lax`
}

function clearAuthCookie() {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`
}

interface AuthStore {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  signIn: (user: User, tokens: AuthTokens) => void
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

      signIn: (user, tokens) => {
        setAuthCookie()
        set({ user, tokens, isAuthenticated: true })
      },

      signOut: () => {
        clearAuthCookie()
        set({ user: null, tokens: null, isAuthenticated: false })
      },
    }),
    {
      name: "urbankey-auth",
      // Only persist token — user is restored from /users/me on load
      partialize: (state) => ({ tokens: state.tokens }),
    }
  )
)
