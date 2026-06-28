"use client"

import { Heart } from "lucide-react"
import { useFavoritesStore } from "@/stores/favorites.store"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  propertyId: number
}

export function FavoriteButton({ propertyId }: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(propertyId))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        toggleFavorite(propertyId)
      }}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex size-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
        isFavorite
          ? "bg-[var(--gold)] text-[var(--navy)]"
          : "bg-black/30 text-white hover:bg-[var(--gold)] hover:text-[var(--navy)]"
      )}
    >
      <Heart className={cn("size-4", isFavorite && "fill-current")} />
    </button>
  )
}
