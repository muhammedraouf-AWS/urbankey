"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/config/api"
import type { Property, PropertyFilters } from "@/types/property"
import type { PaginatedResponse } from "@/types/common"

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () =>
      apiClient.get<PaginatedResponse<Property>>(endpoints.properties.list, {
        params: filters as Record<string, string | number | boolean | undefined>,
      }),
  })
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: ["property", slug],
    queryFn: () => apiClient.get<Property>(endpoints.properties.single(slug)),
    enabled: !!slug,
  })
}
