import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock } from "lucide-react"
import { fetchPost, fetchRelatedPosts } from "@/features/blog/services"
import { AuthorCard } from "@/features/blog/components/AuthorCard"
import { RelatedPosts } from "@/features/blog/components/RelatedPosts"
import { formatDate, absoluteUrl } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import { breadcrumbJsonLd, defaultOgImages } from "@/lib/seo"

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await fetchPost(slug)
    return {
      title: `${post.title} | ${siteConfig.name}`,
      description: post.excerpt,
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: absoluteUrl(`/blog/${slug}`),
        siteName: siteConfig.name,
        type: "article",
        publishedTime: post.date,
        images: post.featuredImage
          ? [
              {
                url: post.featuredImage.url,
                width: post.featuredImage.width,
                height: post.featuredImage.height,
                alt: post.title,
              },
            ]
          : defaultOgImages(),
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: [post.featuredImage?.url ?? siteConfig.ogImage],
      },
    }
  } catch {
    return { title: "Article Not Found" }
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await fetchPost(slug).catch(() => notFound())
  const relatedPosts = await fetchRelatedPosts(post)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.date,
    ...(post.featuredImage && { image: post.featuredImage.url }),
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.ogImage),
      },
    },
  }

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: absoluteUrl("/") },
    { name: "Blog", url: absoluteUrl("/blog") },
    { name: post.title, url: absoluteUrl(`/blog/${post.slug}`) },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-background">
        {post.featuredImage && (
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Main column */}
            <article className="space-y-8 lg:col-span-2">
              <div>
                {post.categories.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {post.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/blog?category=${category.slug}`}
                        className="rounded-full bg-[var(--navy)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}

                <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
                  {post.title}
                </h1>

                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatDate(post.date)}</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4" />
                    {post.readingTime} min read
                  </span>
                </div>
              </div>

              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </article>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24">
                <AuthorCard author={post.author} />
              </div>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-16 border-t border-border pt-10">
              <RelatedPosts posts={relatedPosts} />
            </div>
          )}
        </div>
      </main>
    </>
  )
}
