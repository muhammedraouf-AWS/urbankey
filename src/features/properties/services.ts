import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/config/api"
import type { Property, PropertyFilters } from "@/types/property"
import type { PaginatedResponse } from "@/types/common"

function toWPParams(
  filters: PropertyFilters
): Record<string, string | number | boolean | undefined> {
  return {
    page:         filters.page,
    per_page:     filters.perPage,
    search:       filters.search,
    listing_type: filters.listingType,
    type:         filters.type,
    status:       filters.status,
    featured:     filters.featured,
    min_price:    filters.minPrice,
    max_price:    filters.maxPrice,
    min_beds:     filters.minBedrooms,
    max_beds:     filters.maxBedrooms,
    min_baths:    filters.minBathrooms,
    min_area:     filters.minArea,
    max_area:     filters.maxArea,
    city:         filters.city,
    amenities:    filters.amenities?.join(","),
    orderby:      filters.sortBy,
    order:        filters.sortOrder,
  }
}

export async function fetchProperties(
  filters: PropertyFilters = {}
): Promise<PaginatedResponse<Property>> {
  return apiClient.get<PaginatedResponse<Property>>(endpoints.properties.list, {
    params: toWPParams(filters),
    revalidate: 3600,
    tags: ["properties"],
  })
}

export async function fetchProperty(slug: string): Promise<Property> {
  return apiClient.get<Property>(endpoints.properties.single(slug), {
    revalidate: 3600,
    tags: ["properties", `property-${slug}`],
  })
}

export async function fetchPropertiesForMap(
  filters: Omit<PropertyFilters, "page" | "perPage"> = {}
): Promise<Property[]> {
  const response = await apiClient.get<PaginatedResponse<Property>>(
    endpoints.properties.list,
    {
      params: toWPParams({ ...filters, page: 1, perPage: 100 }),
      revalidate: 3600,
      tags: ["properties"],
    }
  )
  return response.data
}

export async function fetchFeaturedProperties(): Promise<Property[]> {
  const response = await apiClient.get<PaginatedResponse<Property>>(
    endpoints.properties.list,
    {
      params: { featured: true, per_page: 6 },
      revalidate: 3600,
      tags: ["properties"],
    }
  )
  return response.data
}
