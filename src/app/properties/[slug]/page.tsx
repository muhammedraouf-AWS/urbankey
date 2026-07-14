import type { Metadata } from "next"
import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { MapPin, Bed, Bath, Square, Calendar, Building2, Home } from "lucide-react"
import { fetchProperty } from "@/features/properties/services"
import { PropertyGallery } from "@/features/properties/components/PropertyGallery"
import { PropertyAmenities } from "@/features/properties/components/PropertyAmenities"
import { AgentCard } from "@/features/properties/components/AgentCard"
import { FavoriteButton } from "@/features/properties/components/FavoriteButton"
import { RecentlyViewedTracker } from "@/features/properties/components/RecentlyViewedTracker"
import { formatPrice, formatArea, absoluteUrl, cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const property = await fetchProperty(slug)
    const image = property.images[0]
    const description = property.description.slice(0, 160)
    return {
      title: `${property.title} | ${siteConfig.name}`,
      description,
      openGraph: {
        title: property.title,
        description,
        url: absoluteUrl(`/properties/${slug}`),
        siteName: siteConfig.name,
        images: image
          ? [{ url: image.url, width: image.width, height: image.height, alt: property.title }]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: property.title,
        description,
        images: image ? [image.url] : [],
      },
    }
  } catch {
    return { title: "Property Not Found" }
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const property = await fetchProperty(slug).catch(() => notFound())

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: absoluteUrl(`/properties/${property.slug}`),
    ...(property.images[0] && { image: property.images[0].url }),
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency,
      availability:
        property.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.location.address,
      addressLocality: property.location.city,
      addressRegion: property.location.state,
      postalCode: property.location.zipCode,
      addressCountry: property.location.country,
    },
    numberOfRooms: property.bedrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.area,
      unitCode: property.areaUnit === "sqft" ? "FTK" : "MTK",
    },
  }

  const fullAddress = [
    property.location.address,
    property.location.city,
    property.location.state,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-background">
        <RecentlyViewedTracker propertyId={property.id} />
        <PropertyGallery images={property.images} title={property.title} />

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Main column */}
            <div className="space-y-10 lg:col-span-2">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                        property.listingType === "sale"
                          ? "bg-[var(--navy)] text-white"
                          : "bg-[var(--gold)] text-[var(--navy)]"
                      )}
                    >
                      {property.listingType === "sale" ? "For Sale" : "For Rent"}
                    </span>
                    {property.status !== "available" && (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {property.status}
                      </span>
                    )}
                  </div>
                  <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
                    {property.title}
                  </h1>
                  {fullAddress && (
                    <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="size-4 shrink-0 text-[var(--gold)]" />
                      {fullAddress}
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  <FavoriteButton propertyId={property.id} />
                </div>
              </div>

              {/* Specs grid */}
              <div>
                <h2 className="mb-4 font-serif text-xl font-semibold">Property Details</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {property.bedrooms > 0 && (
                    <SpecCard
                      icon={<Bed className="size-5" />}
                      label="Bedrooms"
                      value={String(property.bedrooms)}
                    />
                  )}
                  <SpecCard
                    icon={<Bath className="size-5" />}
                    label="Bathrooms"
                    value={String(property.bathrooms)}
                  />
                  <SpecCard
                    icon={<Square className="size-5" />}
                    label="Area"
                    value={formatArea(property.area, property.areaUnit)}
                  />
                  <SpecCard
                    icon={<Home className="size-5" />}
                    label="Type"
                    value={property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  />
                  {property.yearBuilt && (
                    <SpecCard
                      icon={<Calendar className="size-5" />}
                      label="Year Built"
                      value={String(property.yearBuilt)}
                    />
                  )}
                  {property.floors && (
                    <SpecCard
                      icon={<Building2 className="size-5" />}
                      label="Floor"
                      value={String(property.floors)}
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h2 className="mb-4 font-serif text-xl font-semibold">About this Property</h2>
                  <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <PropertyAmenities amenities={property.amenities} />
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24 space-y-6">
                {/* Price card */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <p className="font-serif text-3xl font-semibold text-foreground">
                    {formatPrice(property.price, property.currency)}
                    {property.listingType === "rent" && (
                      <span className="ml-1 text-base font-normal text-muted-foreground">/mo</span>
                    )}
                  </p>
                  {property.location.city && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {property.location.city}
                      {property.location.state ? `, ${property.location.state}` : ""}
                    </p>
                  )}
                  <div className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Ref ID</span>
                      <span className="font-medium text-foreground">{property.id}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span>Status</span>
                      <span className="font-medium capitalize text-foreground">
                        {property.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agent card */}
                <AgentCard
                  agent={property.agent ?? null}
                  propertyTitle={property.title}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function SpecCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <span className="mt-0.5 text-[var(--gold)]">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
