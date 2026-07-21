export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="aspect-[21/9] w-full animate-pulse bg-muted" />

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-3">
              <div className="h-6 w-32 animate-pulse rounded-full bg-muted" />
              <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
              <div className="h-5 w-48 animate-pulse rounded bg-muted" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded bg-muted"
                  style={{ width: `${70 + (i % 4) * 8}%` }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="h-20 animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}
