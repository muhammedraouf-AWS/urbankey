"use client"

import { useEffect } from "react"
import { useRecentlyViewedStore } from "@/stores/recently-viewed.store"

export function RecentlyViewedTracker({ propertyId }: { propertyId: number }) {
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addRecentlyViewed)

  useEffect(() => {
    addRecentlyViewed(propertyId)
  }, [propertyId, addRecentlyViewed])

  return null
}
