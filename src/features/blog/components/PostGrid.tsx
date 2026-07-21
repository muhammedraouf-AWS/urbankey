import type { BlogPost } from "@/types/blog"
import { PostCard } from "./PostCard"

interface PostGridProps {
  posts: BlogPost[]
}

export function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-serif text-2xl font-medium text-foreground">No articles found</p>
        <p className="mt-2 text-muted-foreground">
          New articles are published regularly — check back soon.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
