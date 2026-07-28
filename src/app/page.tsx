import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ArrowRight } from "lucide-react"
import { FeaturedProperties } from "@/features/properties/components/FeaturedProperties"
import { PropertyGridSkeleton } from "@/features/properties/components/PropertySkeleton"
import { HeroSection } from "@/components/home/HeroSection"
import { StatsSection } from "@/components/home/StatsSection"
import { HowItWorksSection } from "@/components/home/HowItWorksSection"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { siteConfig } from "@/config/site"
import { defaultOgImages } from "@/lib/seo"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: defaultOgImages(),
  },
  twitter: {
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />

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

      <StatsSection />

      <HowItWorksSection />

      <TestimonialsSection />

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
