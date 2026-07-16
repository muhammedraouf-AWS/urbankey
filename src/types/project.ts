import type { ImageData, QueryParams } from "./common"
import type { PropertyAmenity, AreaUnit } from "./property"

export type ProjectStatus = "upcoming" | "under-construction" | "completed"

export interface ProjectLocation {
  address: string
  city: string
  country: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface ProjectUnit {
  type: string
  bedrooms: number
  bathrooms: number
  area: number
  areaUnit: AreaUnit
  priceFrom: number
  priceTo: number
}

export interface PaymentPlanMilestone {
  label: string
  percentage: number
  dueDate?: string
}

export interface DeveloperSummary {
  id: number
  slug: string
  name: string
  logo: string | null
}

export interface Project {
  id: number
  slug: string
  title: string
  description: string
  status: ProjectStatus
  completionDate: string | null
  totalUnits: number
  availableUnits: number
  currency: string
  minPrice: number
  maxPrice: number
  location: ProjectLocation
  images: ImageData[]
  masterPlan: ImageData | null
  amenities: PropertyAmenity[]
  units: ProjectUnit[]
  paymentPlan: PaymentPlanMilestone[]
  developerId?: number
  developer?: DeveloperSummary
  createdAt: string
  updatedAt: string
}

export interface ProjectFilters extends QueryParams {
  status?: ProjectStatus
  city?: string
  developer?: string
}
