"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, Loader2 } from "lucide-react"
import { useFavoritesStore } from "@/stores/favorites.store"
import { useFavoriteProperties } from "@/features/properties/hooks/useProperties"
import { PropertyGrid } from "@/features/properties/components/PropertyGrid"
import { PropertyGridSkeleton } from "@/features/properties/components/PropertySkeleton"

export default function FavoritesPage() {
  // Wait for Zustand localStorage hydration before rendering
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const favoriteIds   = useFavoritesStore((s) => s.favoriteIds)
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites)
  const { data: properties, isLoading, isError } = useFavoriteProperties()

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="border-b border-border bg-card py-12">
          <div className="container mx-auto px-4">
            <div className="h-9 w-56 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-5 w-40 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <PropertyGridSkeleton />
        </div>
      </main>
    )
  }

  const isEmpty = favoriteIds.length === 0

  return (
    <main className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-foreground">
              Saved Properties
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isEmpty
                ? "No properties saved yet"
                : `${favoriteIds.length} propert${favoriteIds.length === 1 ? "y" : "ies"} saved`}
            </p>
          </div>

          {!isEmpty && (
            <button
              type="button"
              onClick={clearFavorites}
              className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isEmpty ? (
          <EmptyState />
        ) : isLoading ? (
          <PropertyGridSkeleton />
        ) : isError ? (
          <p className="text-center text-sm text-muted-foreground">
            Failed to load saved properties.{" "}
            <Link href="/properties" className="text-[var(--gold)] hover:underline">
              Browse properties
            </Link>
          </p>
        ) : (
          <PropertyGrid properties={properties ?? []} />
        )}
      </div>
    </main>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted">
        <Heart className="size-9 text-muted-foreground" />
      </div>
      <h2 className="mt-6 font-serif text-2xl font-semibold text-foreground">
        No saved properties
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Tap the heart icon on any property to save it here for easy access later.
      </p>
      <Link
        href="/properties"
        className="mt-8 rounded-xl bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Browse Properties
      </Link>
    </div>
  )
}
