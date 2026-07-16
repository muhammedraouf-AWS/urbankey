import type { Metadata } from "next"
import { fetchDevelopers } from "@/features/developers/services"
import { DeveloperGrid } from "@/features/developers/components/DeveloperGrid"
import { Pagination } from "@/components/shared/Pagination"
import { siteConfig } from "@/config/site"
import { defaultOgImages } from "@/lib/seo"

const TITLE = "Developers"
const DESCRIPTION = "Meet the real estate developers behind our off-plan projects."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/developers",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteConfig.url}/developers`,
    images: defaultOgImages(),
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
    images: [siteConfig.ogImage],
  },
}

interface DevelopersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function str(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : ""
}

export default async function DevelopersPage({ searchParams }: DevelopersPageProps) {
  const sp = await searchParams
  const currentPage = Math.max(1, parseInt(str(sp.page) || "1", 10))

  const { data: developers, pagination } = await fetchDevelopers({
    page: currentPage,
    perPage: 24,
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-semibold text-foreground">Developers</h1>
          <p className="mt-2 text-muted-foreground">
            {pagination.total > 0
              ? `${pagination.total} developer${pagination.total === 1 ? "" : "s"}`
              : "No developers found"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <DeveloperGrid developers={developers} />

        {pagination.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/developers"
            />
          </div>
        )}
      </div>
    </main>
  )
}
