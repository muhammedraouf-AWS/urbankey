import type { QueryParams } from "./common"

export interface Developer {
  id: number
  slug: string
  name: string
  bio: string
  logo: string | null
  established: number | null
  website: string
  projectsCount: number
}

export type DeveloperFilters = QueryParams
