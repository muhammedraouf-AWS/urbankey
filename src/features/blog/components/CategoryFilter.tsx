import Link from "next/link"
import { cn } from "@/lib/utils"
import type { BlogTerm } from "@/types/blog"

interface CategoryFilterProps {
  categories: BlogTerm[]
  activeSlug?: string
}

export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
          !activeSlug
            ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--navy)]"
            : "border-border text-muted-foreground hover:border-[var(--gold)] hover:text-[var(--gold)]"
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/blog?category=${category.slug}`}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            activeSlug === category.slug
              ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--navy)]"
              : "border-border text-muted-foreground hover:border-[var(--gold)] hover:text-[var(--gold)]"
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}
