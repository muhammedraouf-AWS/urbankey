import type { Metadata } from "next"
import { fetchPosts, fetchCategories } from "@/features/blog/services"
import { PostGrid } from "@/features/blog/components/PostGrid"
import { CategoryFilter } from "@/features/blog/components/CategoryFilter"
import { Pagination } from "@/components/shared/Pagination"
import { siteConfig } from "@/config/site"
import { defaultOgImages } from "@/lib/seo"

const TITLE = "Blog"
const DESCRIPTION =
  "Market insights, buying guides, and neighbourhood spotlights from the UrbanKey editorial team."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteConfig.url}/blog`,
    images: defaultOgImages(),
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
    images: [siteConfig.ogImage],
  },
}

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function str(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : ""
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const sp = await searchParams
  const currentPage = Math.max(1, parseInt(str(sp.page) || "1", 10))
  const category = str(sp.category) || undefined

  const [{ data: posts, pagination }, categories] = await Promise.all([
    fetchPosts({ page: currentPage, perPage: 9, category }),
    fetchCategories(),
  ])

  const paginationParams: Record<string, string> = {}
  if (category) paginationParams.category = category

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-semibold text-foreground">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Market insights, buying guides, and neighbourhood spotlights.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <CategoryFilter categories={categories} activeSlug={category} />
        </div>

        <PostGrid posts={posts} />

        {pagination.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/blog"
              extraParams={paginationParams}
            />
          </div>
        )}
      </div>
    </main>
  )
}
