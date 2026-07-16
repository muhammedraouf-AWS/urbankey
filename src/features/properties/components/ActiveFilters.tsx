"use client"

import { useRouter } from "next/navigation"
import { X } from "lucide-react"

export interface FilterParams {
  listingType?: string
  type?: string
  minPrice?: string
  maxPrice?: string
  minBedrooms?: string
  sortBy?: string
  sortOrder?: string
}

const CHIP_KEYS = ["listingType", "type", "minPrice", "maxPrice", "minBedrooms"] as const
type ChipKey = (typeof CHIP_KEYS)[number]

const CHIP_LABEL: Record<ChipKey, (v: string) => string> = {
  listingType: (v) => (v === "sale" ? "For Sale" : "For Rent"),
  type: (v) => v.charAt(0).toUpperCase() + v.slice(1),
  minPrice: (v) => `From $${Number(v).toLocaleString()}`,
  maxPrice: (v) => `Up to $${Number(v).toLocaleString()}`,
  minBedrooms: (v) => `${v}+ Beds`,
}

function buildUrl(params: Record<string, string | undefined>): string {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v) p.set(k, v)
  }
  const qs = p.toString()
  return qs ? `/properties?${qs}` : "/properties"
}

export function ActiveFilters({
  listingType,
  type,
  minPrice,
  maxPrice,
  minBedrooms,
  sortBy,
  sortOrder,
}: FilterParams) {
  const router = useRouter()

  const active = CHIP_KEYS.filter((k) => {
    const vals: Record<ChipKey, string | undefined> = {
      listingType,
      type,
      minPrice,
      maxPrice,
      minBedrooms,
    }
    return !!vals[k]
  })

  if (active.length === 0) return null

  const allParams: Record<ChipKey | "sortBy" | "sortOrder", string | undefined> = {
    listingType,
    type,
    minPrice,
    maxPrice,
    minBedrooms,
    sortBy,
    sortOrder,
  }

  const remove = (key: ChipKey) => {
    router.push(buildUrl({ ...allParams, [key]: undefined, page: undefined }))
  }

  const clearAll = () => {
    router.push(buildUrl({ sortBy, sortOrder }))
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {active.map((key) => {
        const vals: Record<ChipKey, string | undefined> = {
          listingType,
          type,
          minPrice,
          maxPrice,
          minBedrooms,
        }
        const val = vals[key]!
        return (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--navy)]/10 px-3 py-1 text-xs font-medium text-[var(--navy)] dark:bg-[var(--navy)]/30 dark:text-blue-700"
          >
            {CHIP_LABEL[key](val)}
            <button
              type="button"
              onClick={() => remove(key)}
              aria-label={`Remove ${CHIP_LABEL[key](val)} filter`}
            >
              <X className="size-3" />
            </button>
          </span>
        )
      })}
      <button
        type="button"
        onClick={clearAll}
        className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}
