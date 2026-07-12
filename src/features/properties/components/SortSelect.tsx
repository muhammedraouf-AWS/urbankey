"use client"

import { useRouter } from "next/navigation"
import type { FilterParams } from "./ActiveFilters"

const SORT_OPTIONS = [
  { label: "Newest First",        sortBy: "",      sortOrder: "" },
  { label: "Price: Low to High",  sortBy: "price", sortOrder: "asc" },
  { label: "Price: High to Low",  sortBy: "price", sortOrder: "desc" },
  { label: "Oldest First",        sortBy: "date",  sortOrder: "asc" },
]

export function SortSelect({ listingType, type, minPrice, maxPrice, minBedrooms, sortBy, sortOrder }: FilterParams) {
  const router = useRouter()
  const current = `${sortBy ?? ""}-${sortOrder ?? ""}`

  const handleChange = (value: string) => {
    const [by, order] = value.split("-")
    const p = new URLSearchParams()
    if (listingType)  p.set("listingType",  listingType)
    if (type)         p.set("type",         type)
    if (minPrice)     p.set("minPrice",     minPrice)
    if (maxPrice)     p.set("maxPrice",     maxPrice)
    if (minBedrooms)  p.set("minBedrooms",  minBedrooms)
    if (by)           p.set("sortBy",       by)
    if (order)        p.set("sortOrder",    order)
    const qs = p.toString()
    router.push(qs ? `/properties?${qs}` : "/properties")
  }

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      aria-label="Sort properties"
      className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={`${opt.sortBy}-${opt.sortOrder}`} value={`${opt.sortBy}-${opt.sortOrder}`}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
