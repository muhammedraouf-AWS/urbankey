import {
  Waves,
  Dumbbell,
  Car,
  Star,
  Eye,
  Wifi,
  Shield,
  Heart,
  Sun,
  Wind,
  TreePine,
  Utensils,
  Tv,
  Snowflake,
  CheckCircle2,
} from "lucide-react"
import type { ComponentType } from "react"
import type { PropertyAmenity } from "@/types/property"

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  "swimming-pool": Waves,
  pool: Waves,
  gym: Dumbbell,
  fitness: Dumbbell,
  parking: Car,
  garage: Car,
  concierge: Star,
  reception: Star,
  "sea-view": Eye,
  view: Eye,
  "smart-home": Wifi,
  wifi: Wifi,
  internet: Wifi,
  security: Shield,
  "pet-friendly": Heart,
  pets: Heart,
  rooftop: Sun,
  terrace: Sun,
  garden: TreePine,
  "green-space": TreePine,
  balcony: Wind,
  restaurant: Utensils,
  "home-cinema": Tv,
  cinema: Tv,
  "air-conditioning": Snowflake,
  ac: Snowflake,
}

interface PropertyAmenitiesProps {
  amenities: PropertyAmenity[]
}

export function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  return (
    <div>
      <h2 className="mb-4 font-serif text-xl font-semibold">Amenities &amp; Features</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {amenities.map((amenity) => {
          const Icon = ICON_MAP[amenity.icon] ?? ICON_MAP[amenity.id] ?? CheckCircle2
          return (
            <div
              key={amenity.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <Icon className="size-5 shrink-0 text-[var(--gold)]" />
              <span className="text-sm font-medium">{amenity.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
