"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { useFavoritesStore } from "@/stores/favorites.store"

export function FavoritesLink() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const count = useFavoritesStore((s) => s.favoriteIds.length)

  return (
    <Link
      href="/dashboard/favorites"
      aria-label={`Saved properties${mounted && count > 0 ? ` (${count})` : ""}`}
      className="relative flex items-center text-muted-foreground transition-colors hover:text-foreground"
    >
      <Heart className="size-5" />
      {mounted && count > 0 && (
        <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-[var(--gold)] text-[10px] font-bold text-[var(--navy)]">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  )
}
