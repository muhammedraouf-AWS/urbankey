"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth.store"
import { getMe } from "@/features/auth/services"

// Restores user data from a persisted token on every page load.
// Token is in localStorage (Zustand persist); user is not, so we re-fetch.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const tokens        = useAuthStore((s) => s.tokens)
  const user          = useAuthStore((s) => s.user)
  const setUser       = useAuthStore((s) => s.setUser)
  const signOut       = useAuthStore((s) => s.signOut)

  useEffect(() => {
    if (!tokens?.token || user) return

    const expired = tokens.expiresAt < Date.now()
    if (expired) {
      signOut()
      return
    }

    getMe(tokens.token)
      .then(setUser)
      .catch(() => signOut()) // invalid token — clear session
  }, [tokens, user, setUser, signOut])

  return <>{children}</>
}
