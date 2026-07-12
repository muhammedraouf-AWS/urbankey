import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/config/api"
import type { SearchResponse } from "@/types/search"

export async function fetchSearchSuggestions(q: string): Promise<SearchResponse> {
  return apiClient.get<SearchResponse>(endpoints.search, { params: { q } })
}
