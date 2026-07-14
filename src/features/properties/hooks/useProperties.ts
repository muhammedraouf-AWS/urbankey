"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/config/api"
import { fetchPropertiesByIds } from "@/features/properties/services"
import { useFavoritesStore } from "@/stores/favorites.store"
import { useRecentlyViewedStore } from "@/stores/recently-viewed.store"
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

export function useFavoriteProperties() {
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds)
  return useQuery({
    queryKey: ["properties", "favorites", favoriteIds],
    queryFn: () => fetchPropertiesByIds(favoriteIds),
    enabled: favoriteIds.length > 0,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  })
}

export function useRecentlyViewedProperties() {
  const propertyIds = useRecentlyViewedStore((s) => s.propertyIds)
  return useQuery({
    queryKey: ["properties", "recently-viewed", propertyIds],
    queryFn: () => fetchPropertiesByIds(propertyIds),
    enabled: propertyIds.length > 0,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  })
}
