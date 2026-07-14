"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, X, Clock } from "lucide-react"
import { useSearchStore } from "@/stores/search.store"

export default function SavedSearchesPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const recentSearches   = useSearchStore((s) => s.recentSearches)
  const removeSearch     = useSearchStore((s) => s.removeRecentSearch)
  const clearSearches    = useSearchStore((s) => s.clearRecentSearches)

  if (!mounted) {
    return (
      <div>
        <div className="border-b border-border bg-card px-6 py-8 lg:px-8">
          <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="p-6 space-y-3 lg:p-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="border-b border-border bg-card px-6 py-8 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">Saved Searches</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {recentSearches.length === 0
                ? "No recent searches"
                : `${recentSearches.length} recent search${recentSearches.length === 1 ? "" : "es"}`}
            </p>
          </div>
          {recentSearches.length > 0 && (
            <button
              type="button"
              onClick={clearSearches}
              className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {recentSearches.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-2">
            {recentSearches.map((query) => (
              <li
                key={query}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-[var(--gold)]"
                >
                  <Clock className="size-4 shrink-0 text-muted-foreground" />
                  {query}
                </Link>
                <button
                  type="button"
                  onClick={() => removeSearch(query)}
                  className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`Remove "${query}"`}
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted">
        <Search className="size-9 text-muted-foreground" />
      </div>
      <h2 className="mt-6 font-serif text-2xl font-semibold text-foreground">No recent searches</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Your search history will appear here. Use the search bar above to find properties.
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
