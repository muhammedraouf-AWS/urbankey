"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { useFavoritesStore } from "@/stores/favorites.store"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  propertyId: number
}

export function FavoriteButton({ propertyId }: FavoriteButtonProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const isFavorite     = useFavoritesStore((s) => s.isFavorite(propertyId))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)

  const active = mounted && isFavorite

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        toggleFavorite(propertyId)
      }}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex size-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
        active
          ? "bg-gold text-navy"
          : "bg-black/30 text-white hover:bg-gold hover:text-navy"
      )}
    >
      <Heart className={cn("size-4", active && "fill-current")} />
    </button>
  )
}
