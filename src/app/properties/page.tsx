import type { Metadata } from "next"
import { fetchProperties } from "@/features/properties/services"
import { PropertyGrid } from "@/features/properties/components/PropertyGrid"
import { Pagination } from "@/components/shared/Pagination"
import type { PropertyFilters, ListingType } from "@/types/property"

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse our curated selection of luxury properties for sale and rent.",
}

const VALID_LISTING_TYPES: ListingType[] = ["sale", "rent"]

interface PropertiesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(String(params.page ?? "1"), 10))
  const rawListingType = String(params.listingType ?? "")
  const listingType = VALID_LISTING_TYPES.includes(rawListingType as ListingType)
    ? (rawListingType as ListingType)
    : undefined

  const filters: PropertyFilters = {
    page: currentPage,
    perPage: 12,
    ...(listingType ? { listingType } : {}),
    ...(params.featured ? { featured: params.featured === "true" } : {}),
  }

  const { data: properties, pagination } = await fetchProperties(filters)

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            {params.listingType === "rent"
              ? "Properties for Rent"
              : params.listingType === "sale"
                ? "Properties for Sale"
                : "All Properties"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {pagination.total > 0
              ? `${pagination.total} propert${pagination.total === 1 ? "y" : "ies"} available`
              : "New listings coming soon"}
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
              basePath="/properties"
            />
          </div>
        )}
      </div>
    </main>
  )
}
