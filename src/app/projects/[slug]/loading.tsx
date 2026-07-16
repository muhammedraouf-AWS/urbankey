export default function ProjectDetailLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="aspect-[16/7] w-full animate-pulse bg-muted" />
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-6 w-32 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          </div>
          <div className="h-48 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </main>
  )
}
