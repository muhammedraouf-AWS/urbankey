import { ProjectGridSkeleton } from "@/features/projects/components/ProjectSkeleton"

export default function DeveloperDetailLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 sm:flex-row">
          <div className="size-24 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <ProjectGridSkeleton />
      </div>
    </main>
  )
}
