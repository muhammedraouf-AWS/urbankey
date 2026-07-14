"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, Settings, LogOut, ChevronDown } from "lucide-react"
import { useAuthStore } from "@/stores/auth.store"

export function UserMenu() {
  const router         = useRouter()
  const user           = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const signOut        = useAuthStore((s) => s.signOut)
  const [open, setOpen]     = useState(false)
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSignOut = () => {
    signOut()
    setOpen(false)
    router.push("/")
    router.refresh()
  }

  // Show nothing until Zustand hydrates to avoid flash
  if (!mounted) {
    return <div className="size-8 animate-pulse rounded-full bg-muted" />
  }

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="rounded-lg border border-border px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        Sign In
      </Link>
    )
  }

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : "U"

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg p-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* Avatar */}
        {user?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt={user.displayName}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
            {initials}
          </span>
        )}
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          {/* User info */}
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium text-foreground">
              {user?.displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/dashboard/favorites"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Heart className="size-4 text-muted-foreground" />
              Saved Properties
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Settings className="size-4 text-muted-foreground" />
              Account Settings
            </Link>
          </div>

          <div className="border-t border-border py-1">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="size-4 text-muted-foreground" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
