import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { MapPin, Building2, Calendar, Home, CheckCircle2 } from "lucide-react"
import { fetchProject } from "@/features/projects/services"
import { UnitsTable } from "@/features/projects/components/UnitsTable"
import { PaymentPlanTimeline } from "@/features/projects/components/PaymentPlanTimeline"
import { formatPrice, absoluteUrl } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import { breadcrumbJsonLd } from "@/lib/seo"

type PageProps = { params: Promise<{ slug: string }> }

const STATUS_LABEL = {
  upcoming: "Upcoming",
  "under-construction": "Under Construction",
  completed: "Completed",
} as const

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const project = await fetchProject(slug)
    const image = project.images[0]
    const description = project.description.slice(0, 160)
    return {
      title: `${project.title} | ${siteConfig.name}`,
      description,
      alternates: {
        canonical: `/projects/${slug}`,
      },
      openGraph: {
        title: project.title,
        description,
        url: absoluteUrl(`/projects/${slug}`),
        siteName: siteConfig.name,
        images: image
          ? [{ url: image.url, width: image.width, height: image.height, alt: project.title }]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description,
        images: image ? [image.url] : [],
      },
    }
  } catch {
    return { title: "Project Not Found" }
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await fetchProject(slug).catch(() => notFound())

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: project.title,
    description: project.description,
    url: absoluteUrl(`/projects/${project.slug}`),
    ...(project.images[0] && { image: project.images[0].url }),
    address: {
      "@type": "PostalAddress",
      streetAddress: project.location.address,
      addressLocality: project.location.city,
      addressCountry: project.location.country,
    },
  }

  const primaryImage = project.images[0]

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: absoluteUrl("/") },
    { name: "Projects", url: absoluteUrl("/projects") },
    { name: project.title, url: absoluteUrl(`/projects/${project.slug}`) },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-background">
        {/* Hero image */}
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || project.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Main column */}
            <div className="space-y-10 lg:col-span-2">
              <div>
                <span className="rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--navy)]">
                  {STATUS_LABEL[project.status]}
                </span>
                <h1 className="mt-3 font-serif text-3xl font-semibold text-foreground md:text-4xl">
                  {project.title}
                </h1>
                {project.location.city && (
                  <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="size-4 shrink-0 text-[var(--gold)]" />
                    {[project.location.address, project.location.city, project.location.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>

              {/* Specs grid */}
              <div>
                <h2 className="mb-4 font-serif text-xl font-semibold">Project Details</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <SpecCard
                    icon={<Home className="size-5" />}
                    label="Total Units"
                    value={String(project.totalUnits)}
                  />
                  <SpecCard
                    icon={<CheckCircle2 className="size-5" />}
                    label="Available Units"
                    value={String(project.availableUnits)}
                  />
                  {project.completionDate && (
                    <SpecCard
                      icon={<Calendar className="size-5" />}
                      label="Completion"
                      value={project.completionDate}
                    />
                  )}
                </div>
              </div>

              {project.description && (
                <div>
                  <h2 className="mb-4 font-serif text-xl font-semibold">About this Project</h2>
                  <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              )}

              {project.masterPlan && (
                <div>
                  <h2 className="mb-4 font-serif text-xl font-semibold">Master Plan</h2>
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
                    <Image
                      src={project.masterPlan.url}
                      alt={project.masterPlan.alt || `${project.title} master plan`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              <UnitsTable units={project.units} currency={project.currency} />
              <PaymentPlanTimeline milestones={project.paymentPlan} />
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24 space-y-6">
                {/* Price card */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="font-serif text-3xl font-semibold text-foreground">
                    {formatPrice(project.minPrice, project.currency)}
                  </p>
                  {project.maxPrice > project.minPrice && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      up to {formatPrice(project.maxPrice, project.currency)}
                    </p>
                  )}
                  <div className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Ref ID</span>
                      <span className="font-medium text-foreground">{project.id}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span>Status</span>
                      <span className="font-medium text-foreground">
                        {STATUS_LABEL[project.status]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Developer card */}
                {project.developer ? (
                  <Link
                    href={`/developers/${project.developer.slug}`}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
                  >
                    <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                      {project.developer.logo ? (
                        <Image
                          src={project.developer.logo}
                          alt={project.developer.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <Building2 className="size-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Developed by</p>
                      <p className="font-semibold text-foreground">{project.developer.name}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-serif text-lg font-semibold">Interested in this project?</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Contact our team for more information about {project.title}.
                    </p>
                    <a
                      href="mailto:info@urbankey.com"
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Request Info
                    </a>
                  </div>
                )}
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
