"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Clock, ArrowRight } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"
import { useSearch } from "../hooks/useSearch"
import { useSearchStore } from "@/stores/search.store"
import { cn } from "@/lib/utils"
import type { SearchResult } from "@/types/search"

const RESULT_PATH: Record<string, string> = {
  property: "/properties",
  uk_agent: "/agents",
  uk_project: "/projects",
}

const RESULT_LABEL: Record<string, string> = {
  property: "Property",
  uk_agent: "Agent",
  uk_project: "Project",
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const debouncedQuery = useDebounce(query, 400)
  const { data, isFetching } = useSearch(debouncedQuery)
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } =
    useSearchStore()

  const open = useCallback(() => {
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery("")
  }, [])

  const navigate = useCallback(
    (url: string, searchQuery?: string) => {
      if (searchQuery) addRecentSearch(searchQuery)
      router.push(url)
      close()
    },
    [router, close, addRecentSearch]
  )

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen, close])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) close()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, close])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`, q)
  }

  const handleResultClick = (result: SearchResult) => {
    const base = RESULT_PATH[result.type] ?? "/properties"
    navigate(`${base}/${result.slug}`, query.trim() || result.title)
  }

  const suggestions = data?.results ?? []
  const showSuggestions = debouncedQuery.length >= 2
  const showRecents = query.length < 2 && recentSearches.length > 0
  const showEmpty = showSuggestions && !isFetching && suggestions.length === 0
  const showDropdown = isOpen && (showRecents || showSuggestions)

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      {!isOpen ? (
        <button
          onClick={open}
          aria-label="Open search"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Search className="size-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties, agents…"
              className="h-9 w-48 rounded-lg border border-border bg-muted pl-9 pr-3 text-sm outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] sm:w-64 md:w-80"
            />
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close search"
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </form>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card shadow-xl sm:w-96">
          {/* Recent searches */}
          {showRecents && (
            <div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Recent
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
              {recentSearches.map((q) => (
                <div key={q} className="flex items-center gap-2 px-4 hover:bg-muted">
                  <button
                    onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
                    className="flex flex-1 items-center gap-3 py-2.5 text-left text-sm"
                  >
                    <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{q}</span>
                  </button>
                  <button
                    onClick={() => removeRecentSearch(q)}
                    aria-label={`Remove "${q}" from recent searches`}
                    className="shrink-0 text-muted-foreground/50 hover:text-muted-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Loading */}
          {isFetching && showSuggestions && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <span className="size-3 animate-spin rounded-full border border-current border-t-transparent" />
              Searching…
            </div>
          )}

          {/* Suggestions */}
          {!isFetching && suggestions.length > 0 && (
            <div>
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Results
              </p>
              {suggestions.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-muted"
                >
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                      result.type === "property"
                        ? "bg-[var(--navy)]/10 text-[var(--navy)] dark:bg-[var(--navy)]/30"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {RESULT_LABEL[result.type] ?? result.type}
                  </span>
                  <span className="flex-1 truncate font-medium">{result.title}</span>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                </button>
              ))}
              {query.trim() && (
                <button
                  onClick={() => navigate(`/search?q=${encodeURIComponent(query.trim())}`, query.trim())}
                  className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-sm font-medium text-[var(--gold)] hover:bg-muted"
                >
                  <Search className="size-3.5" />
                  See all results for &ldquo;{query}&rdquo;
                </button>
              )}
            </div>
          )}

          {/* Empty */}
          {showEmpty && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results for &ldquo;{debouncedQuery}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  )
}
