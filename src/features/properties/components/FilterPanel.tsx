"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterValues {
  listingType: string
  type: string
  minPrice: string
  maxPrice: string
  minBedrooms: string
}

export interface FilterPanelProps extends FilterValues {
  sortBy: string
  sortOrder: string
}

const PROPERTY_TYPES = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa",     value: "villa" },
  { label: "Penthouse", value: "penthouse" },
  { label: "Townhouse", value: "townhouse" },
  { label: "Studio",    value: "studio" },
  { label: "Office",    value: "office" },
  { label: "Retail",    value: "retail" },
  { label: "Land",      value: "land" },
]

const BED_OPTIONS = ["1", "2", "3", "4", "5"]

export function FilterPanel({
  listingType: initListingType,
  type: initType,
  minPrice: initMinPrice,
  maxPrice: initMaxPrice,
  minBedrooms: initMinBedrooms,
  sortBy,
  sortOrder,
}: FilterPanelProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const [draft, setDraft] = useState<FilterValues>({
    listingType: initListingType,
    type:        initType,
    minPrice:    initMinPrice,
    maxPrice:    initMaxPrice,
    minBedrooms: initMinBedrooms,
  })

  const set = <K extends keyof FilterValues>(key: K, value: FilterValues[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }))

  const buildUrl = useCallback(
    (values: FilterValues) => {
      const p = new URLSearchParams()
      if (sortBy)              p.set("sortBy",      sortBy)
      if (sortOrder)           p.set("sortOrder",   sortOrder)
      if (values.listingType)  p.set("listingType", values.listingType)
      if (values.type)         p.set("type",        values.type)
      if (values.minPrice)     p.set("minPrice",    values.minPrice)
      if (values.maxPrice)     p.set("maxPrice",    values.maxPrice)
      if (values.minBedrooms)  p.set("minBedrooms", values.minBedrooms)
      const qs = p.toString()
      return qs ? `/properties?${qs}` : "/properties"
    },
    [sortBy, sortOrder]
  )

  const apply = useCallback(() => {
    router.push(buildUrl(draft))
    setIsOpen(false)
  }, [draft, buildUrl, router])

  const reset = useCallback(() => {
    router.push(buildUrl({ listingType: "", type: "", minPrice: "", maxPrice: "", minBedrooms: "" }))
    setIsOpen(false)
  }, [buildUrl, router])

  const activeCount = [
    draft.listingType,
    draft.type,
    draft.minPrice || draft.maxPrice,
    draft.minBedrooms,
  ].filter(Boolean).length

  const formContent = (
    <div className="space-y-6">
      {/* Listing type */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          For
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {(["", "sale", "rent"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set("listingType", v)}
              className={cn(
                "rounded-lg border py-2 text-sm font-medium transition-colors",
                draft.listingType === v
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-border text-foreground hover:border-muted-foreground"
              )}
            >
              {v === "" ? "All" : v === "sale" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>
      </div>

      {/* Property type */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Property Type
        </p>
        <select
          value={draft.type}
          onChange={(e) => set("type", e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
        >
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price Range
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={draft.minPrice}
            onChange={(e) => set("minPrice", e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
          />
          <span className="shrink-0 text-muted-foreground">–</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={draft.maxPrice}
            onChange={(e) => set("maxPrice", e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Bedrooms
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => set("minBedrooms", "")}
            className={cn(
              "flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
              draft.minBedrooms === ""
                ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                : "border-border hover:border-muted-foreground"
            )}
          >
            Any
          </button>
          {BED_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set("minBedrooms", n)}
              className={cn(
                "flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
                draft.minBedrooms === n
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-border hover:border-muted-foreground"
              )}
            >
              {n}+
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={apply}
          className="flex-1 rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Apply Filters
        </button>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors lg:hidden",
          activeCount > 0
            ? "border-[var(--gold)] text-[var(--gold)]"
            : "border-border text-foreground"
        )}
      >
        <SlidersHorizontal className="size-4" />
        Filters
        {activeCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-[var(--gold)] text-xs font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Mobile modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold">Filters</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            {formContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-[240px] shrink-0 lg:block">
        <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-5 font-serif text-base font-semibold">Filters</h2>
          {formContent}
        </div>
      </aside>
    </>
  )
}
