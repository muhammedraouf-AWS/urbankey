"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Scale } from "lucide-react"
import { useCompareStore, MAX_COMPARE } from "@/stores/compare.store"
import { useCompareProperties } from "@/features/properties/hooks/useProperties"

export function CompareDrawer() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const compareIds     = useCompareStore((s) => s.compareIds)
  const removeFromCompare = useCompareStore((s) => s.removeFromCompare)
  const clearCompare   = useCompareStore((s) => s.clearCompare)
  const { data: properties } = useCompareProperties()

  if (!mounted || compareIds.length === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Scale className="size-4 text-gold" />
            {compareIds.length} of {MAX_COMPARE} selected
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            {(properties ?? []).map((property) => {
              const thumb = property.images[0]
              return (
                <div
                  key={property.id}
                  className="group relative size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
                  title={property.title}
                >
                  {thumb ? (
                    <Image src={thumb.url} alt={property.title} fill sizes="40px" className="object-cover" />
                  ) : null}
                  <button
                    onClick={() => removeFromCompare(property.id)}
                    aria-label={`Remove ${property.title} from compare`}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={clearCompare}
            className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
          <Link
            href="/compare"
            className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Compare
          </Link>
        </div>
      </div>
    </div>
  )
}
