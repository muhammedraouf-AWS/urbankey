import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/config/api"
import type { Property, PropertyFilters } from "@/types/property"
import type { PaginatedResponse } from "@/types/common"

export async function fetchProperties(
  filters: PropertyFilters = {}
): Promise<PaginatedResponse<Property>> {
  return apiClient.get<PaginatedResponse<Property>>(endpoints.properties.list, {
    params: filters as Record<string, string | number | boolean | undefined>,
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
