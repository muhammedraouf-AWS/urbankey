import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Square } from "lucide-react"
import { cn, formatPrice, formatArea } from "@/lib/utils"
import type { Property } from "@/types/property"
import { FavoriteButton } from "./FavoriteButton"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const primaryImage = property.images[0]

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
      {/* Image */}
      <Link href={`/properties/${property.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}

        {/* Listing type badge */}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            property.listingType === "sale"
              ? "bg-[var(--navy)] text-white"
              : "bg-[var(--gold)] text-[var(--navy)]"
          )}
        >
          {property.listingType === "sale" ? "For Sale" : "For Rent"}
        </span>
      </Link>

      {/* Favorite button */}
      <div className="absolute right-3 top-3">
        <FavoriteButton propertyId={property.id} />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xl font-semibold text-foreground">
          {formatPrice(property.price, property.currency)}
          {property.listingType === "rent" && (
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          )}
        </p>

        <Link href={`/properties/${property.slug}`}>
          <h3 className="mt-1 line-clamp-1 font-serif text-lg font-medium text-foreground transition-colors hover:text-[var(--gold)]">
            {property.title}
          </h3>
        </Link>

        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="line-clamp-1">
            {property.location.city}, {property.location.state}
          </span>
        </p>

        {/* Specs */}
        <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Bed className="size-4" />
            {property.bedrooms} bd
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="size-4" />
            {property.bathrooms} ba
          </span>
          <span className="flex items-center gap-1.5">
            <Square className="size-4" />
            {formatArea(property.area, property.areaUnit)}
          </span>
        </div>
      </div>
    </article>
  )
}
