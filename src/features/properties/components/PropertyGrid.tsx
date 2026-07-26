import type { Property } from "@/types/property"
import { PropertyCard } from "./PropertyCard"

interface PropertyGridProps {
  properties: Property[]
  priorityCount?: number
}

export function PropertyGrid({ properties, priorityCount = 0 }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-serif text-2xl font-medium text-foreground">
          No properties found
        </p>
        <p className="mt-2 text-muted-foreground">
          New listings are added regularly — check back soon.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property, index) => (
        <PropertyCard key={property.id} property={property} priority={index < priorityCount} />
      ))}
    </div>
  )
}
