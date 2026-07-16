import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/config/api"
import type { Developer, DeveloperFilters } from "@/types/developer"
import type { PaginatedResponse } from "@/types/common"

export async function fetchDevelopers(
  filters: DeveloperFilters = {}
): Promise<PaginatedResponse<Developer>> {
  return apiClient.get<PaginatedResponse<Developer>>(endpoints.developers.list, {
    params: { page: filters.page, per_page: filters.perPage, search: filters.search },
    revalidate: 3600,
    tags: ["developers"],
  })
}

export async function fetchDeveloper(slug: string): Promise<Developer> {
  return apiClient.get<Developer>(endpoints.developers.single(slug), {
    revalidate: 3600,
    tags: ["developers", `developer-${slug}`],
  })
}
