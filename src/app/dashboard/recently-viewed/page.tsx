"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock } from "lucide-react"
import { useRecentlyViewedStore } from "@/stores/recently-viewed.store"
import { useRecentlyViewedProperties } from "@/features/properties/hooks/useProperties"
import { PropertyGrid } from "@/features/properties/components/PropertyGrid"
import { PropertyGridSkeleton } from "@/features/properties/components/PropertySkeleton"

export default function RecentlyViewedPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const propertyIds       = useRecentlyViewedStore((s) => s.propertyIds)
  const clearRecentlyViewed = useRecentlyViewedStore((s) => s.clearRecentlyViewed)
  const { data: properties, isLoading, isError } = useRecentlyViewedProperties()

  if (!mounted) {
    return (
      <div>
        <div className="border-b border-border bg-card px-6 py-8 lg:px-8">
          <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="p-6 lg:p-8">
          <PropertyGridSkeleton />
        </div>
      </div>
    )
  }

  const isEmpty = propertyIds.length === 0

  return (
    <div>
      <div className="border-b border-border bg-card px-6 py-8 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">Recently Viewed</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isEmpty
                ? "No recently viewed properties"
                : `${propertyIds.length} propert${propertyIds.length === 1 ? "y" : "ies"} viewed`}
            </p>
          </div>
          {!isEmpty && (
            <button
              type="button"
              onClick={clearRecentlyViewed}
              className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear history
            </button>
          )}
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {isEmpty ? (
          <EmptyState />
        ) : isLoading ? (
          <PropertyGridSkeleton />
        ) : isError ? (
          <p className="text-center text-sm text-muted-foreground">
            Failed to load properties.{" "}
            <Link href="/properties" className="text-gold hover:underline">
              Browse properties
            </Link>
          </p>
        ) : (
          <PropertyGrid properties={properties ?? []} />
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted">
        <Clock className="size-9 text-muted-foreground" />
      </div>
      <h2 className="mt-6 font-serif text-2xl font-semibold text-foreground">
        No recently viewed properties
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Properties you visit will appear here so you can easily find them again.
      </p>
      <Link
        href="/properties"
        className="mt-8 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Browse Properties
      </Link>
    </div>
  )
}
