import { apiConfig, endpoints } from "@/config/api"
import { parseError } from "@/lib/utils"
import type { BlogAuthor, BlogFilters, BlogListResult, BlogPost, BlogTerm } from "@/types/blog"

interface WpTerm {
  id: number
  name: string
  slug: string
  taxonomy: string
}

interface WpEmbedded {
  author?: Array<{ id: number; name: string; avatar_urls?: Record<string, string> }>
  "wp:featuredmedia"?: Array<{
    source_url: string
    alt_text: string
    media_details?: { width: number; height: number }
  }>
  "wp:term"?: WpTerm[][]
}

interface WpPost {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  _embedded?: WpEmbedded
}

interface WpCategory {
  id: number
  name: string
  slug: string
  count: number
}

function buildUrl(
  path: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(`${apiConfig.baseUrl}${apiConfig.wpJsonPath}${path}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value))
  })
  return url.toString()
}

/**
 * Native WP REST pagination totals only ever arrive via the `X-WP-Total` /
 * `X-WP-TotalPages` response headers, never in the JSON body — so this can't
 * reuse `apiClient`, which discards the response object after parsing.
 */
async function wpGet<T>(
  url: string,
  options: { revalidate?: number; tags?: string[] } = {}
): Promise<{ data: T; total: number; totalPages: number }> {
  try {
    const response = await fetch(url, {
      next: { revalidate: options.revalidate ?? 3600, tags: options.tags ?? ["blog"] },
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const data = (await response.json()) as T
    return {
      data,
      total: Number(response.headers.get("X-WP-Total") ?? 0),
      totalPages: Number(response.headers.get("X-WP-TotalPages") ?? 0),
    }
  } catch (error) {
    throw new Error(`GET ${url} failed: ${parseError(error)}`)
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .trim()
}

function estimateReadingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function mapAuthor(embedded?: WpEmbedded): BlogAuthor {
  const author = embedded?.author?.[0]
  return {
    id: author?.id ?? 0,
    name: author?.name ?? "UrbanKey Editorial",
    avatar: author?.avatar_urls?.["96"] ?? null,
  }
}

function mapTerms(embedded: WpEmbedded | undefined, taxonomy: "category" | "post_tag"): BlogTerm[] {
  const groups = embedded?.["wp:term"] ?? []
  return groups
    .flat()
    .filter((term) => term.taxonomy === taxonomy && term.slug !== "uncategorized")
    .map((term) => ({ id: term.id, name: term.name, slug: term.slug }))
}

function mapPost(post: WpPost): BlogPost {
  const media = post._embedded?.["wp:featuredmedia"]?.[0]
  const title = stripHtml(post.title.rendered)

  return {
    id: post.id,
    slug: post.slug,
    title,
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content.rendered,
    date: post.date,
    featuredImage: media
      ? {
          id: 0,
          url: media.source_url,
          alt: media.alt_text || title,
          width: media.media_details?.width ?? 1200,
          height: media.media_details?.height ?? 630,
        }
      : null,
    author: mapAuthor(post._embedded),
    categories: mapTerms(post._embedded, "category"),
    tags: mapTerms(post._embedded, "post_tag"),
    readingTime: estimateReadingTime(post.content.rendered),
  }
}

async function resolveCategoryId(slug: string): Promise<number | undefined> {
  const url = buildUrl(endpoints.blog.categories, { slug, per_page: 1 })
  const { data } = await wpGet<WpCategory[]>(url)
  return data[0]?.id
}

export async function fetchPosts(filters: BlogFilters = {}): Promise<BlogListResult> {
  const page = filters.page ?? 1
  const perPage = filters.perPage ?? 9

  const categoryId = filters.category ? await resolveCategoryId(filters.category) : undefined

  const url = buildUrl(endpoints.blog.list, {
    page,
    per_page: perPage,
    search: filters.search,
    categories: categoryId,
    _embed: true,
  })

  const { data, total, totalPages } = await wpGet<WpPost[]>(url, { tags: ["blog"] })

  return {
    data: data.map(mapPost),
    pagination: { total, totalPages, currentPage: page, perPage },
  }
}

export async function fetchPost(slug: string): Promise<BlogPost> {
  const url = buildUrl(endpoints.blog.single(slug), { _embed: true })
  const { data } = await wpGet<WpPost[]>(url, { tags: ["blog", `post-${slug}`] })
  const post = data[0]
  if (!post) throw new Error("Post not found")
  return mapPost(post)
}

export async function fetchRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  if (post.categories.length === 0) return []

  const url = buildUrl(endpoints.blog.list, {
    categories: post.categories[0]?.id,
    exclude: post.id,
    per_page: limit,
    _embed: true,
  })

  const { data } = await wpGet<WpPost[]>(url, { tags: ["blog"] })
  return data.map(mapPost)
}

export async function fetchCategories(): Promise<BlogTerm[]> {
  const url = buildUrl(endpoints.blog.categories, {
    per_page: 100,
    hide_empty: true,
    orderby: "count",
    order: "desc",
  })
  const { data } = await wpGet<WpCategory[]>(url, { tags: ["blog"] })
  return data
    .filter((category) => category.slug !== "uncategorized")
    .map((category) => ({ id: category.id, name: category.name, slug: category.slug }))
}
