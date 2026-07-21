import { PostGridSkeleton } from "@/features/blog/components/PostSkeleton"

export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-muted" />
          ))}
        </div>
        <PostGridSkeleton />
      </div>
    </main>
  )
}
