export type SearchResultType = "property" | "uk_agent" | "uk_project"

export interface SearchResult {
  id: number
  slug: string
  title: string
  type: SearchResultType
}

export interface SearchResponse {
  query: string
  results: SearchResult[]
  total: number
}
