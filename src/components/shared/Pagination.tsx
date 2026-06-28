import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildHref = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`

  const pages: (number | "…")[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…")
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <Link
        href={buildHref(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={cn(
          "flex size-9 items-center justify-center rounded-lg border border-border text-sm transition-colors",
          currentPage === 1
            ? "pointer-events-none opacity-40"
            : "hover:border-[var(--gold)] hover:text-[var(--gold)]"
        )}
      >
        <ChevronLeft className="size-4" />
      </Link>

      {pages.map((page, i) =>
        page === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex size-9 items-center justify-center text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={cn(
              "flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
              page === currentPage
                ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--navy)]"
                : "border-border hover:border-[var(--gold)] hover:text-[var(--gold)]"
            )}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={buildHref(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={cn(
          "flex size-9 items-center justify-center rounded-lg border border-border text-sm transition-colors",
          currentPage === totalPages
            ? "pointer-events-none opacity-40"
            : "hover:border-[var(--gold)] hover:text-[var(--gold)]"
        )}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  )
}
