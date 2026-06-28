import type { ImageData, QueryParams } from "./common"

export type PropertyStatus = "available" | "sold" | "rented" | "off-market"
export type PropertyType =
  | "apartment"
  | "villa"
  | "penthouse"
  | "townhouse"
  | "studio"
  | "office"
  | "retail"
  | "land"
export type ListingType = "sale" | "rent"
export type AreaUnit = "sqft" | "sqm"

export interface PropertyLocation {
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface PropertyAmenity {
  id: string
  label: string
  icon: string
}

export interface FloorPlan {
  id: number
  label: string
  image: ImageData
}

export interface AgentSummary {
  id: number
  slug: string
  name: string
  email: string
  phone: string
  whatsapp: string
  avatar: string | null
  yearsExperience: number
}

export interface Property {
  id: number
  slug: string
  title: string
  description: string
  price: number
  currency: string
  status: PropertyStatus
  type: PropertyType
  listingType: ListingType
  bedrooms: number
  bathrooms: number
  area: number
  areaUnit: AreaUnit
  floors?: number
  yearBuilt?: number
  location: PropertyLocation
  images: ImageData[]
  floorPlans?: FloorPlan[]
  amenities: PropertyAmenity[]
  videoUrl?: string
  virtualTourUrl?: string
  agentId?: number
  agent?: AgentSummary
  projectId?: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface PropertyFilters extends QueryParams {
  type?: PropertyType
  listingType?: ListingType
  status?: PropertyStatus
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  maxBedrooms?: number
  minBathrooms?: number
  minArea?: number
  maxArea?: number
  city?: string
  amenities?: string[]
  featured?: boolean
}
