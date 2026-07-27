import Link from "next/link"
import Image from "next/image"
import { Building2 } from "lucide-react"
import type { DeveloperSummary } from "@/types/project"
import { RequestInfoButton } from "@/features/leads/components/RequestInfoButton"

interface DeveloperContactCardProps {
  developer: DeveloperSummary | null
  projectId: number
  projectTitle: string
}

export function DeveloperContactCard({
  developer,
  projectId,
  projectTitle,
}: DeveloperContactCardProps) {
  return (
    <div className="space-y-6">
      {developer && (
        <Link
          href={`/developers/${developer.slug}`}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
        >
          <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
            {developer.logo ? (
              <Image src={developer.logo} alt={developer.name} fill sizes="56px" className="object-cover" />
            ) : (
              <Building2 className="size-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Developed by</p>
            <p className="font-semibold text-foreground">{developer.name}</p>
          </div>
        </Link>
      )}

      {/* Always shown, developer listed or not. */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-serif text-lg font-semibold">Interested in this project?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Contact our team for more information about {projectTitle}.
        </p>
        <div className="mt-4">
          <RequestInfoButton propertyId={projectId} propertyTitle={projectTitle} />
        </div>
      </div>
    </div>
  )
}
