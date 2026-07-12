"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchSearchSuggestions } from "../services"

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchSuggestions(query),
    enabled: query.trim().length >= 2,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  })
}
