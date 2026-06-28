import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { fetchFeaturedProperties } from "../services"
import { PropertyCard } from "./PropertyCard"

export async function FeaturedProperties() {
  const properties = await fetchFeaturedProperties()

  if (properties.length === 0) return null

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--gold)]">
              Handpicked
            </p>
            <h2 className="mt-1 font-serif text-4xl font-semibold text-foreground">
              Featured Properties
            </h2>
          </div>
          <Link
            href="/properties?featured=true"
            className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}
