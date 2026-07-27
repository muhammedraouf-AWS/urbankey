"use client"

import { useEffect, useState } from "react"
import { Scale } from "lucide-react"
import { useCompareStore, MAX_COMPARE } from "@/stores/compare.store"
import { cn } from "@/lib/utils"

interface CompareButtonProps {
  propertyId: number
}

export function CompareButton({ propertyId }: CompareButtonProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const isInCompare    = useCompareStore((s) => s.isInCompare(propertyId))
  const toggleCompare  = useCompareStore((s) => s.toggleCompare)
  const compareCount   = useCompareStore((s) => s.compareIds.length)

  const active = mounted && isInCompare
  const atLimit = mounted && !active && compareCount >= MAX_COMPARE

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        if (atLimit) return
        toggleCompare(propertyId)
      }}
      disabled={atLimit}
      aria-label={
        active
          ? "Remove from compare"
          : atLimit
            ? `Compare list full (max ${MAX_COMPARE})`
            : "Add to compare"
      }
      title={atLimit ? `You can compare up to ${MAX_COMPARE} properties` : undefined}
      className={cn(
        "flex size-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
        active
          ? "bg-gold text-navy"
          : atLimit
            ? "cursor-not-allowed bg-black/20 text-white/40"
            : "bg-black/30 text-white hover:bg-gold hover:text-navy"
      )}
    >
      <Scale className="size-4" />
    </button>
  )
}
