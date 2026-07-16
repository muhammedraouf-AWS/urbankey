export function DeveloperSkeleton() {
  return (
    <div className="flex animate-pulse flex-col items-center rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 size-20 rounded-full bg-muted" />
      <div className="h-5 w-24 rounded bg-muted" />
      <div className="mt-2 h-4 w-16 rounded bg-muted" />
    </div>
  )
}

export function DeveloperGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <DeveloperSkeleton key={i} />
      ))}
    </div>
  )
}
