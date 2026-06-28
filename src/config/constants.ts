export const PROPERTY_TYPES = [
  "apartment",
  "villa",
  "penthouse",
  "townhouse",
  "studio",
  "office",
  "retail",
  "land",
] as const

export const LISTING_TYPES = ["sale", "rent"] as const

export const PROPERTY_STATUSES = ["available", "sold", "rented", "off-market"] as const

export const SORT_OPTIONS = [
  { label: "Newest First", value: "date-desc" },
  { label: "Oldest First", value: "date-asc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Area: Low to High", value: "area-asc" },
  { label: "Area: High to Low", value: "area-desc" },
] as const

export const PRICE_RANGES = [
  { label: "Under $500K", min: 0, max: 500_000 },
  { label: "$500K – $1M", min: 500_000, max: 1_000_000 },
  { label: "$1M – $2M", min: 1_000_000, max: 2_000_000 },
  { label: "$2M – $5M", min: 2_000_000, max: 5_000_000 },
  { label: "$5M+", min: 5_000_000, max: undefined },
] as const

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5] as const

export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 50
export const MAX_COMPARE_PROPERTIES = 4
export const SEARCH_DEBOUNCE_MS = 350
export const QUERY_STALE_TIME_MS = 60_000
export const TOKEN_REFRESH_THRESHOLD_SECONDS = 300
