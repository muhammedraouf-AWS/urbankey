import type { ImageData, QueryParams } from "./common"

export interface BlogAuthor {
  id: number
  name: string
  avatar: string | null
}

export interface BlogTerm {
  id: number
  name: string
  slug: string
}

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  featuredImage: ImageData | null
  author: BlogAuthor
  categories: BlogTerm[]
  tags: BlogTerm[]
  readingTime: number
}

export interface BlogFilters extends QueryParams {
  category?: string
}

export interface BlogListResult {
  data: BlogPost[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    perPage: number
  }
}
