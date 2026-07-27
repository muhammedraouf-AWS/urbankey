"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Scale, X, Check, Minus } from "lucide-react"
import { useCompareStore } from "@/stores/compare.store"
import { useCompareProperties } from "@/features/properties/hooks/useProperties"
import { cn, formatPrice, formatArea } from "@/lib/utils"
import type { Property } from "@/types/property"

interface SpecRow {
  label: string
  value: (property: Property) => string
}

const SPEC_ROWS: SpecRow[] = [
  { label: "Price", value: (p) => formatPrice(p.price, p.currency) + (p.listingType === "rent" ? "/mo" : "") },
  { label: "Listing Type", value: (p) => (p.listingType === "sale" ? "For Sale" : "For Rent") },
  { label: "Status", value: (p) => p.status.replace("-", " ") },
  { label: "Property Type", value: (p) => p.type },
  { label: "Bedrooms", value: (p) => String(p.bedrooms) },
  { label: "Bathrooms", value: (p) => String(p.bathrooms) },
  { label: "Area", value: (p) => formatArea(p.area, p.areaUnit) },
  { label: "Year Built", value: (p) => (p.yearBuilt ? String(p.yearBuilt) : "—") },
  { label: "Floors", value: (p) => (p.floors ? String(p.floors) : "—") },
  { label: "City", value: (p) => p.location.city || "—" },
]

export function CompareTable() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const compareIds        = useCompareStore((s) => s.compareIds)
  const removeFromCompare = useCompareStore((s) => s.removeFromCompare)
  const clearCompare      = useCompareStore((s) => s.clearCompare)
  const { data: properties, isLoading, isError } = useCompareProperties()

  if (!mounted) return <TableSkeleton />

  if (compareIds.length === 0) return <EmptyState />

  if (isLoading) return <TableSkeleton />

  if (isError || !properties || properties.length === 0) {
    return (
      <p className="py-24 text-center text-sm text-muted-foreground">
        Failed to load properties to compare.{" "}
        <Link href="/properties" className="text-gold hover:underline">
          Browse properties
        </Link>
      </p>
    )
  }

  const allAmenityLabels = Array.from(
    new Map(properties.flatMap((p) => p.amenities).map((a) => [a.id, a.label])).entries()
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Comparing {properties.length} propert{properties.length === 1 ? "y" : "ies"}
        </p>
        <button
          onClick={clearCompare}
          className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="w-40 shrink-0 px-4 py-3 text-left font-medium text-muted-foreground">
                &nbsp;
              </th>
              {properties.map((property) => (
                <th key={property.id} className="min-w-[200px] px-4 py-3 text-left align-top">
                  <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
                    {property.images[0] ? (
                      <Image
                        src={property.images[0].url}
                        alt={property.images[0].alt || property.title}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    ) : null}
                    <button
                      onClick={() => removeFromCompare(property.id)}
                      aria-label={`Remove ${property.title} from compare`}
                      className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                  <Link
                    href={`/properties/${property.slug}`}
                    className="font-serif text-base font-medium text-foreground hover:text-gold"
                  >
                    {property.title}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPEC_ROWS.map((row) => {
              const values = properties.map((p) => row.value(p))
              const differs = new Set(values).size > 1
              return (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    {row.label}
                  </th>
                  {properties.map((property, i) => (
                    <td
                      key={property.id}
                      className={cn(
                        "px-4 py-3 capitalize text-foreground",
                        differs && "bg-gold/10 font-medium"
                      )}
                    >
                      {values[i]}
                    </td>
                  ))}
                </tr>
              )
            })}

            {allAmenityLabels.map(([id, label]) => (
              <tr key={id} className="border-b border-border last:border-0">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{label}</th>
                {properties.map((property) => {
                  const has = property.amenities.some((a) => a.id === id)
                  return (
                    <td key={property.id} className="px-4 py-3">
                      {has ? (
                        <Check className="size-4 text-gold" />
                      ) : (
                        <Minus className="size-4 text-muted-foreground/40" />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted">
        <Scale className="size-9 text-muted-foreground" />
      </div>
      <h2 className="mt-6 font-serif text-2xl font-semibold text-foreground">
        No properties to compare
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Tap the compare icon on any property card to add it here — you can compare up to 4 at once.
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

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-5 w-40 rounded bg-muted" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-lg bg-muted" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-muted" />
    </div>
  )
}
