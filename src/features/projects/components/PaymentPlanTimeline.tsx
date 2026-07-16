import type { PaymentPlanMilestone } from "@/types/project"

interface PaymentPlanTimelineProps {
  milestones: PaymentPlanMilestone[]
}

export function PaymentPlanTimeline({ milestones }: PaymentPlanTimelineProps) {
  if (milestones.length === 0) return null

  return (
    <div>
      <h2 className="mb-4 font-serif text-xl font-semibold">Payment Plan</h2>
      <ol className="space-y-4">
        {milestones.map((milestone, i) => (
          <li key={i} className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] text-sm font-semibold text-[var(--navy)]">
              {milestone.percentage}%
            </span>
            <div className="pt-1.5">
              <p className="font-medium text-foreground">{milestone.label}</p>
              {milestone.dueDate && (
                <p className="text-sm text-muted-foreground">{milestone.dueDate}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
