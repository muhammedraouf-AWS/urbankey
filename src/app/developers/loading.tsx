import { DeveloperGridSkeleton } from "@/features/developers/components/DeveloperSkeleton"

export default function DevelopersLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-52 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-5 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <DeveloperGridSkeleton />
      </div>
    </main>
  )
}
