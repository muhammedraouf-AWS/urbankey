import type { Metadata } from "next"
import { fetchProjects } from "@/features/projects/services"
import { ProjectGrid } from "@/features/projects/components/ProjectGrid"
import { Pagination } from "@/components/shared/Pagination"
import type { ProjectStatus } from "@/types/project"
import { siteConfig } from "@/config/site"
import { defaultOgImages } from "@/lib/seo"

const TITLE = "Off-Plan Projects"
const DESCRIPTION = "Explore upcoming and under-construction developments from leading real estate developers."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteConfig.url}/projects`,
    images: defaultOgImages(),
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
    images: [siteConfig.ogImage],
  },
}

interface ProjectsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function str(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : ""
}

const VALID_STATUSES: ProjectStatus[] = ["upcoming", "under-construction", "completed"]

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const sp = await searchParams

  const currentPage = Math.max(1, parseInt(str(sp.page) || "1", 10))
  const statusRaw   = str(sp.status)
  const status      = VALID_STATUSES.includes(statusRaw as ProjectStatus)
    ? (statusRaw as ProjectStatus)
    : undefined

  const { data: projects, pagination } = await fetchProjects({
    status,
    page: currentPage,
    perPage: 12,
  })

  const paginationParams: Record<string, string> = {}
  if (status) paginationParams.status = status

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-semibold text-foreground">Off-Plan Projects</h1>
          <p className="mt-2 text-muted-foreground">
            {pagination.total > 0
              ? `${pagination.total} project${pagination.total === 1 ? "" : "s"} available`
              : "No projects match your criteria"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ProjectGrid projects={projects} />

        {pagination.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/projects"
              extraParams={paginationParams}
            />
          </div>
        )}
      </div>
    </main>
  )
}
