import type { Metadata } from "next"
import { fetchProperties } from "@/features/properties/services"
import { PropertyGrid } from "@/features/properties/components/PropertyGrid"
import { FilterPanel } from "@/features/properties/components/FilterPanel"
import { ActiveFilters } from "@/features/properties/components/ActiveFilters"
import { SortSelect } from "@/features/properties/components/SortSelect"
import { Pagination } from "@/components/shared/Pagination"
import type { ListingType, PropertyType } from "@/types/property"
import type { SortOrder } from "@/types/common"

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse our curated selection of luxury properties for sale and rent.",
}

interface PropertiesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function str(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : ""
}

const VALID_LISTING_TYPES: ListingType[] = ["sale", "rent"]
const VALID_SORT_ORDERS: SortOrder[] = ["asc", "desc"]

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const sp = await searchParams

  const currentPage    = Math.max(1, parseInt(str(sp.page) || "1", 10))
  const listingTypeRaw = str(sp.listingType)
  const listingType    = VALID_LISTING_TYPES.includes(listingTypeRaw as ListingType)
    ? (listingTypeRaw as ListingType)
    : undefined
  const type           = (str(sp.type) as PropertyType) || undefined
  const minPrice       = str(sp.minPrice) ? Number(str(sp.minPrice))  : undefined
  const maxPrice       = str(sp.maxPrice) ? Number(str(sp.maxPrice))  : undefined
  const minBedrooms    = str(sp.minBedrooms) ? Number(str(sp.minBedrooms)) : undefined
  const sortBy         = str(sp.sortBy)    || undefined
  const sortOrderRaw   = str(sp.sortOrder)
  const sortOrder      = VALID_SORT_ORDERS.includes(sortOrderRaw as SortOrder)
    ? (sortOrderRaw as SortOrder)
    : undefined

  const { data: properties, pagination } = await fetchProperties({
    page:       currentPage,
    perPage:    12,
    listingType,
    type,
    minPrice,
    maxPrice,
    minBedrooms,
    sortBy,
    sortOrder,
  })

  // Shared param objects passed to all client components
  const filterParams = {
    listingType: str(sp.listingType)  || undefined,
    type:        str(sp.type)         || undefined,
    minPrice:    str(sp.minPrice)     || undefined,
    maxPrice:    str(sp.maxPrice)     || undefined,
    minBedrooms: str(sp.minBedrooms)  || undefined,
    sortBy:      str(sp.sortBy)       || undefined,
    sortOrder:   str(sp.sortOrder)    || undefined,
  }

  // All active filter params (no page) for Pagination's extraParams
  const paginationParams: Record<string, string> = {}
  for (const [k, v] of Object.entries(filterParams)) {
    if (v) paginationParams[k] = v
  }

  // Reset FilterPanel draft state whenever URL changes
  const filterKey = `${filterParams.listingType}-${filterParams.type}-${filterParams.minPrice}-${filterParams.maxPrice}-${filterParams.minBedrooms}`

  const pageTitle =
    listingType === "rent" ? "Properties for Rent"
    : listingType === "sale" ? "Properties for Sale"
    : "All Properties"

  return (
    <main className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-semibold text-foreground">{pageTitle}</h1>
          <p className="mt-2 text-muted-foreground">
            {pagination.total > 0
              ? `${pagination.total} propert${pagination.total === 1 ? "y" : "ies"} available`
              : "No properties match your criteria"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* FilterPanel: mobile trigger + desktop sidebar, both in one component */}
          <FilterPanel
            key={filterKey}
            listingType={str(sp.listingType)}
            type={str(sp.type)}
            minPrice={str(sp.minPrice)}
            maxPrice={str(sp.maxPrice)}
            minBedrooms={str(sp.minBedrooms)}
            sortBy={str(sp.sortBy)}
            sortOrder={str(sp.sortOrder)}
          />

          {/* Main content */}
          <div className="mt-4 min-w-0 flex-1 lg:mt-0">
            {/* Results bar */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {pagination.total} propert{pagination.total === 1 ? "y" : "ies"}
              </p>
              <SortSelect {...filterParams} />
            </div>

            {/* Active filter chips */}
            <ActiveFilters {...filterParams} />

            {/* Grid */}
            <PropertyGrid properties={properties} />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  basePath="/properties"
                  extraParams={paginationParams}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
