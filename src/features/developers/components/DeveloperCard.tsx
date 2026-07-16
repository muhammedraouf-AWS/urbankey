import Link from "next/link"
import Image from "next/image"
import { Building2, Calendar } from "lucide-react"
import type { Developer } from "@/types/developer"

interface DeveloperCardProps {
  developer: Developer
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <Link
      href={`/developers/${developer.slug}`}
      className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg"
    >
      <div className="relative mb-4 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
        {developer.logo ? (
          <Image src={developer.logo} alt={developer.name} fill sizes="80px" className="object-cover" />
        ) : (
          <Building2 className="size-8 text-muted-foreground" />
        )}
      </div>

      <h3 className="font-serif text-lg font-medium text-foreground transition-colors group-hover:text-[var(--gold)]">
        {developer.name}
      </h3>

      <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          {developer.projectsCount} project{developer.projectsCount === 1 ? "" : "s"}
        </span>
        {developer.established && (
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            Est. {developer.established}
          </span>
        )}
      </div>
    </Link>
  )
}
