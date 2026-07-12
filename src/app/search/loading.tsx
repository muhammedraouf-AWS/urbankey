import { PropertyGridSkeleton } from "@/features/properties/components/PropertySkeleton"

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4 space-y-3">
          <div className="h-10 w-56 animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <PropertyGridSkeleton count={12} />
      </div>
    </div>
  )
}
