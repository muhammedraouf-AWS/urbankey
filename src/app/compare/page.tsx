import type { Metadata } from "next"
import { CompareTable } from "@/features/properties/components/CompareTable"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: `Compare Properties — ${siteConfig.name}`,
  description: "Compare up to 4 properties side by side.",
  alternates: {
    canonical: "/compare",
  },
  // Content is driven entirely by client-side local storage, empty by default for every visitor.
  robots: { index: false, follow: true },
}

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            Compare Properties
          </h1>
          <p className="mt-2 text-muted-foreground">
            See specs and amenities side by side to find the right fit.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <CompareTable />
      </div>
    </main>
  )
}
