import Link from "next/link"
import { Suspense } from "react"
import { ArrowRight } from "lucide-react"
import { FeaturedProperties } from "@/features/properties/components/FeaturedProperties"
import { PropertyGridSkeleton } from "@/features/properties/components/PropertySkeleton"

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="absolute inset-0 bg-[var(--navy)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.35_0.08_255)_0%,_oklch(0.18_0.08_255)_70%)]" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-[var(--gold)]">
            Premium Real Estate
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
            Find Your Perfect
            <br />
            <span className="text-[var(--gold)]">Urban Key</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Discover luxury properties, exclusive apartments, and premium
            investments curated for those who expect the extraordinary.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-8 py-3.5 text-sm font-semibold text-[var(--navy)] transition-opacity hover:opacity-90"
            >
              Browse Properties <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/properties?listingType=rent"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Properties for Rent
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <Suspense
        fallback={
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="mb-10 h-10 w-52 animate-pulse rounded bg-muted" />
              <PropertyGridSkeleton count={3} />
            </div>
          </section>
        }
      >
        <FeaturedProperties />
      </Suspense>

      {/* CTA */}
      <section className="border-t border-border bg-card py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Ready to find your next home?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Browse our full collection of properties across the city.
          </p>
          <Link
            href="/properties"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-8 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View All Properties <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
