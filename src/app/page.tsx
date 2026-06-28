export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-semibold tracking-tight text-foreground">
          UrbanKey
        </h1>
        <p className="mt-3 text-xl text-muted-foreground">Premium Real Estate Platform</p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm text-muted-foreground">
          <span className="size-2 rounded-full bg-green-500" />
          Phase 1 — Foundation Complete
        </div>
      </div>
    </main>
  )
}
