import Image from "next/image"
import type { BlogAuthor } from "@/types/blog"

interface AuthorCardProps {
  author: BlogAuthor
}

export function AuthorCard({ author }: AuthorCardProps) {
  const initial = author.name.charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
      {author.avatar ? (
        <Image
          src={author.avatar}
          alt={author.name}
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--navy)] text-lg font-semibold text-white">
          {initial}
        </div>
      )}
      <div>
        <p className="text-xs text-muted-foreground">Written by</p>
        <p className="font-medium text-foreground">{author.name}</p>
      </div>
    </div>
  )
}
