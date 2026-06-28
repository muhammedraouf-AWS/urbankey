export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    perPage: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export type SortOrder = "asc" | "desc"

export interface QueryParams {
  page?: number
  perPage?: number
  search?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface SelectOption<T extends string = string> {
  label: string
  value: T
}

export interface ImageData {
  id: number
  url: string
  alt: string
  width: number
  height: number
}
