import Link from "next/link"
import Image from "next/image"
import { MapPin, Building2 } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import type { Project } from "@/types/project"

interface ProjectCardProps {
  project: Project
}

const STATUS_LABEL: Record<Project["status"], string> = {
  upcoming: "Upcoming",
  "under-construction": "Under Construction",
  completed: "Completed",
}

export function ProjectCard({ project }: ProjectCardProps) {
  const primaryImage = project.images[0]

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
      <Link href={`/projects/${project.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}

        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            project.status === "completed"
              ? "bg-[var(--navy)] text-white"
              : "bg-[var(--gold)] text-[var(--navy)]"
          )}
        >
          {STATUS_LABEL[project.status]}
        </span>
      </Link>

      <div className="p-4">
        <p className="text-xl font-semibold text-foreground">
          {formatPrice(project.minPrice, project.currency)}
          {project.maxPrice > project.minPrice && (
            <span className="text-sm font-normal text-muted-foreground">
              {" "}– {formatPrice(project.maxPrice, project.currency)}
            </span>
          )}
        </p>

        <Link href={`/projects/${project.slug}`}>
          <h3 className="mt-1 line-clamp-1 font-serif text-lg font-medium text-foreground transition-colors hover:text-[var(--gold)]">
            {project.title}
          </h3>
        </Link>

        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="line-clamp-1">{project.location.city}</span>
        </p>

        <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
          {project.developer && (
            <span className="line-clamp-1 flex items-center gap-1.5">
              <Building2 className="size-4 shrink-0" />
              {project.developer.name}
            </span>
          )}
          {project.completionDate && (
            <span className="ml-auto shrink-0">{project.completionDate}</span>
          )}
        </div>
      </div>
    </article>
  )
}
