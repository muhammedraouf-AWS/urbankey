import { PropertyGridSkeleton } from "@/features/properties/components/PropertySkeleton"

export default function PropertiesLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-52 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-5 w-40 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <PropertyGridSkeleton />
      </div>
    </main>
  )
}
