import type { Developer } from "@/types/developer"
import { DeveloperCard } from "./DeveloperCard"

interface DeveloperGridProps {
  developers: Developer[]
}

export function DeveloperGrid({ developers }: DeveloperGridProps) {
  if (developers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-serif text-2xl font-medium text-foreground">
          No developers found
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {developers.map((developer) => (
        <DeveloperCard key={developer.id} developer={developer} />
      ))}
    </div>
  )
}
