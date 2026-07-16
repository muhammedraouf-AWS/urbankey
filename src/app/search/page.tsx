import type { Metadata } from "next"
import { Search } from "lucide-react"
import { fetchProperties } from "@/features/properties/services"
import { PropertyGrid } from "@/features/properties/components/PropertyGrid"
import { Pagination } from "@/components/shared/Pagination"
import { siteConfig } from "@/config/site"

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  const query = q?.trim()
  return {
    title: query ? `"${query}" — ${siteConfig.name}` : `Search — ${siteConfig.name}`,
    description: query
      ? `Search results for "${query}" on ${siteConfig.name}.`
      : "Search our curated selection of luxury properties.",
    alternates: {
      canonical: "/search",
    },
    // Internal search-result pages are thin/duplicate content — keep them out of the index.
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const q = params.q?.trim() ?? ""
  const currentPage = Math.max(1, parseInt(String(params.page ?? "1"), 10))

  if (!q) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <Search className="size-7 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Search Properties
          </h1>
          <p className="text-muted-foreground">
            Use the search bar above to find properties, agents, and more.
          </p>
        </div>
      </main>
    )
  }

  const { data: properties, pagination } = await fetchProperties({
    search: q,
    page: currentPage,
    perPage: 12,
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            Search Results
          </h1>
          <p className="mt-2 text-muted-foreground">
            {pagination.total > 0
              ? `${pagination.total} propert${pagination.total === 1 ? "y" : "ies"} found for “${q}”`
              : `No properties found for “${q}”`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <PropertyGrid properties={properties} />

        {pagination.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/search"
              extraParams={{ q }}
            />
          </div>
        )}
      </div>
    </main>
  )
}
