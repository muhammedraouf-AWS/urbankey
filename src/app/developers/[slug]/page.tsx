import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Building2, Calendar, Globe } from "lucide-react"
import { fetchDeveloper } from "@/features/developers/services"
import { fetchProjects } from "@/features/projects/services"
import { ProjectGrid } from "@/features/projects/components/ProjectGrid"
import { absoluteUrl } from "@/lib/utils"
import { siteConfig } from "@/config/site"

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const developer = await fetchDeveloper(slug)
    const description = developer.bio.slice(0, 160)
    return {
      title: `${developer.name} | ${siteConfig.name}`,
      description,
      openGraph: {
        title: developer.name,
        description,
        url: absoluteUrl(`/developers/${slug}`),
        siteName: siteConfig.name,
        images: developer.logo ? [{ url: developer.logo }] : [],
        type: "website",
      },
    }
  } catch {
    return { title: "Developer Not Found" }
  }
}

export default async function DeveloperDetailPage({ params }: PageProps) {
  const { slug } = await params
  const developer = await fetchDeveloper(slug).catch(() => notFound())
  const { data: projects } = await fetchProjects({ developer: slug, perPage: 12 })

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center sm:flex-row sm:text-left">
          <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
            {developer.logo ? (
              <Image src={developer.logo} alt={developer.name} fill sizes="96px" className="object-cover" />
            ) : (
              <Building2 className="size-10 text-muted-foreground" />
            )}
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
              {developer.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
              <span>
                {developer.projectsCount} project{developer.projectsCount === 1 ? "" : "s"}
              </span>
              {developer.established && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  Est. {developer.established}
                </span>
              )}
              {developer.website && (
                <a
                  href={developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[var(--gold)] hover:underline"
                >
                  <Globe className="size-3.5" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {developer.bio && (
          <p className="mb-10 max-w-3xl whitespace-pre-line leading-relaxed text-muted-foreground">
            {developer.bio}
          </p>
        )}

        <h2 className="mb-4 font-serif text-xl font-semibold">Projects by {developer.name}</h2>
        <ProjectGrid projects={projects} />
      </div>
    </main>
  )
}
