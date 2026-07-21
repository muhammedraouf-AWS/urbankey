import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@/types/blog"

interface PostCardProps {
  post: BlogPost
}

export function PostCard({ post }: PostCardProps) {
  const category = post.categories[0]

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}

        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--navy)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {category.name}
          </span>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="line-clamp-2 font-serif text-lg font-medium text-foreground transition-colors hover:text-[var(--gold)]">
            {post.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>

        <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>{formatDate(post.date)}</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {post.readingTime} min read
          </span>
        </div>
      </div>
    </article>
  )
}
