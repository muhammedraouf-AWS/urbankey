import Image from "next/image"
import { Phone, Mail, MessageCircle, User } from "lucide-react"
import type { AgentSummary } from "@/types/property"

interface AgentCardProps {
  agent: AgentSummary | null
  propertyTitle: string
}

export function AgentCard({ agent, propertyTitle }: AgentCardProps) {
  if (!agent) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-serif text-lg font-semibold">Interested in this property?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Contact our team for more information about {propertyTitle}.
        </p>
        <a
          href="mailto:info@urbankey.com"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Mail className="size-4" />
          Request Info
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-4 font-serif text-lg font-semibold">Listed by</h3>

      <div className="mb-5 flex items-center gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-muted">
          {agent.avatar ? (
            <Image
              src={agent.avatar}
              alt={agent.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="size-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-foreground">{agent.name}</p>
          {agent.yearsExperience > 0 && (
            <p className="text-sm text-muted-foreground">
              {agent.yearsExperience} yrs experience
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {agent.phone && (
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Phone className="size-4" />
            Call Agent
          </a>
        )}
        {agent.whatsapp && (
          <a
            href={`https://wa.me/${agent.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        )}
        {agent.email && (
          <a
            href={`mailto:${agent.email}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Mail className="size-4" />
            Email Agent
          </a>
        )}
      </div>
    </div>
  )
}
