"use client"

import { useRouter } from "next/navigation"
import { LayoutList, Map } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ViewToggleProps {
  currentView: "list" | "map"
  params: Record<string, string | undefined>
}

export function ViewToggle({ currentView, params }: ViewToggleProps) {
  const router = useRouter()

  const buildUrl = (view: "list" | "map"): string => {
    const p = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v) p.set(k, v)
    }
    if (view === "map") {
      p.set("view", "map")
    } else {
      p.delete("view")
    }
    const qs = p.toString()
    return qs ? `/properties?${qs}` : "/properties"
  }

  return (
    <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
      <button
        type="button"
        onClick={() => router.push(buildUrl("list"))}
        aria-label="List view"
        aria-pressed={currentView === "list"}
        className={cn(
          "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm transition-colors",
          currentView === "list"
            ? "bg-[var(--navy)] text-white"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <LayoutList className="size-4" />
        <span className="hidden sm:inline">List</span>
      </button>
      <button
        type="button"
        onClick={() => router.push(buildUrl("map"))}
        aria-label="Map view"
        aria-pressed={currentView === "map"}
        className={cn(
          "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm transition-colors",
          currentView === "map"
            ? "bg-[var(--navy)] text-white"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Map className="size-4" />
        <span className="hidden sm:inline">Map</span>
      </button>
    </div>
  )
}
