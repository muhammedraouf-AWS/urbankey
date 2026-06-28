export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Gallery skeleton */}
      <div className="grid h-64 grid-cols-[2fr_1fr] gap-1 sm:h-96 lg:h-[480px]">
        <div className="animate-pulse bg-muted" />
        <div className="grid grid-rows-2 gap-1">
          <div className="animate-pulse bg-muted" />
          <div className="animate-pulse bg-muted" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-10 lg:col-span-2">
            {/* Header */}
            <div className="space-y-3">
              <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
              <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
            </div>

            {/* Specs */}
            <div className="space-y-4">
              <div className="h-7 w-40 animate-pulse rounded bg-muted" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="h-7 w-48 animate-pulse rounded bg-muted" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded bg-muted"
                  style={{ width: `${70 + (i % 4) * 8}%` }}
                />
              ))}
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <div className="h-7 w-52 animate-pulse rounded bg-muted" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="h-40 animate-pulse rounded-2xl bg-muted" />
            <div className="h-56 animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}
