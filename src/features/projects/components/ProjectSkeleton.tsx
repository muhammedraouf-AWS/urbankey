export function ProjectSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[4/3] bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-6 w-40 rounded bg-muted" />
        <div className="h-5 w-48 rounded bg-muted" />
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="flex gap-4 border-t border-border pt-3">
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectSkeleton key={i} />
      ))}
    </div>
  )
}
