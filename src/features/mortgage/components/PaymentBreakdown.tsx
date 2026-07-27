import { formatPrice } from "@/lib/utils"

interface PaymentBreakdownProps {
  principal: number
  interest: number
  currency: string
}

export function PaymentBreakdown({ principal, interest, currency }: PaymentBreakdownProps) {
  const total = principal + interest
  if (total <= 0) return null

  const principalPct = (principal / total) * 100
  const interestPct = 100 - principalPct

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        First Payment Breakdown
      </p>

      {/* Stacked bar: principal + interest, 2px surface gap between segments */}
      <div className="flex h-6 w-full gap-0.5 overflow-hidden rounded-full">
        <div
          className="flex items-center justify-center rounded-l-full bg-chart-principal text-[10px] font-semibold text-white"
          style={{ width: `${principalPct}%` }}
        >
          {principalPct > 20 && `${Math.round(principalPct)}%`}
        </div>
        <div
          className="flex items-center justify-center rounded-r-full bg-chart-interest text-[10px] font-semibold text-navy"
          style={{ width: `${interestPct}%` }}
        >
          {interestPct > 20 && `${Math.round(interestPct)}%`}
        </div>
      </div>

      {/* Legend — always present for 2+ series */}
      <div className="mt-3 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full bg-chart-principal" />
          <span className="text-muted-foreground">Principal</span>
          <span className="font-medium text-foreground">{formatPrice(principal, currency)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full bg-chart-interest" />
          <span className="text-muted-foreground">Interest</span>
          <span className="font-medium text-foreground">{formatPrice(interest, currency)}</span>
        </div>
      </div>
    </div>
  )
}
