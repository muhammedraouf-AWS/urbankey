import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/config/api"
import type { Project, ProjectFilters } from "@/types/project"
import type { PaginatedResponse } from "@/types/common"

function toWPParams(
  filters: ProjectFilters
): Record<string, string | number | boolean | undefined> {
  return {
    page:      filters.page,
    per_page:  filters.perPage,
    search:    filters.search,
    status:    filters.status,
    city:      filters.city,
    developer: filters.developer,
    orderby:   filters.sortBy,
    order:     filters.sortOrder,
  }
}

export async function fetchProjects(
  filters: ProjectFilters = {}
): Promise<PaginatedResponse<Project>> {
  return apiClient.get<PaginatedResponse<Project>>(endpoints.projects.list, {
    params: toWPParams(filters),
    revalidate: 3600,
    tags: ["projects"],
  })
}

export async function fetchProject(slug: string): Promise<Project> {
  return apiClient.get<Project>(endpoints.projects.single(slug), {
    revalidate: 3600,
    tags: ["projects", `project-${slug}`],
  })
}
