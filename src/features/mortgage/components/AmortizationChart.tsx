"use client"

import { useId, useMemo, useState } from "react"
import { formatPrice } from "@/lib/utils"
import type { AmortizationYear } from "@/lib/mortgage"

interface AmortizationChartProps {
  schedule: AmortizationYear[]
  currency: string
}

const WIDTH = 640
const HEIGHT = 280
const PAD = { top: 16, right: 16, bottom: 28, left: 64 }

export function AmortizationChart({ schedule, currency }: AmortizationChartProps) {
  const gridId = useId()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [showTable, setShowTable] = useState(false)

  const cumulative = useMemo(() => {
    const totals: { principal: number; interest: number }[] = []
    let principal = 0
    let interest = 0
    for (const y of schedule) {
      principal += y.principalPaid
      interest += y.interestPaid
      totals.push({ principal, interest })
    }
    return totals
  }, [schedule])

  const maxBalance = Math.max(...schedule.map((y) => y.balance), 1)
  const plotW = WIDTH - PAD.left - PAD.right
  const plotH = HEIGHT - PAD.top - PAD.bottom

  const xFor = (i: number) =>
    PAD.left + (schedule.length === 1 ? 0 : (i / (schedule.length - 1)) * plotW)
  const yFor = (balance: number) => PAD.top + plotH - (balance / maxBalance) * plotH

  const linePath = schedule
    .map((y, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(y.balance)}`)
    .join(" ")
  const areaPath = `${linePath} L ${xFor(schedule.length - 1)} ${PAD.top + plotH} L ${xFor(0)} ${PAD.top + plotH} Z`

  // Round y-axis ticks to clean values
  const tickCount = 4
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => (maxBalance / tickCount) * i)

  // Thin x-axis labels so they don't crowd on longer terms
  const xLabelStep = Math.max(1, Math.ceil(schedule.length / 6))

  const handlePointer = (clientX: number, svg: SVGSVGElement) => {
    const rect = svg.getBoundingClientRect()
    const scale = WIDTH / rect.width
    const x = (clientX - rect.left) * scale
    const ratio = Math.min(1, Math.max(0, (x - PAD.left) / plotW))
    const index = Math.round(ratio * (schedule.length - 1))
    setActiveIndex(Math.min(schedule.length - 1, Math.max(0, index)))
  }

  const active = activeIndex !== null ? schedule[activeIndex] : null
  const activeCumulative = activeIndex !== null ? cumulative[activeIndex] : null

  if (schedule.length === 0) return null

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          Remaining Balance Over Time
        </h3>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="text-sm font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          {showTable ? "Show chart" : "View full schedule"}
        </button>
      </div>

      {showTable ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">Principal Paid</th>
                <th className="px-4 py-3 font-medium">Interest Paid</th>
                <th className="px-4 py-3 font-medium">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((y) => (
                <tr key={y.year} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{y.year}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatPrice(y.principalPaid, currency)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatPrice(y.interestPaid, currency)}
                  </td>
                  <td className="px-4 py-3 text-foreground">{formatPrice(y.balance, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full touch-none"
            role="img"
            aria-label="Line chart of remaining loan balance by year"
            tabIndex={0}
            onPointerMove={(e) => handlePointer(e.clientX, e.currentTarget)}
            onPointerLeave={() => setActiveIndex(null)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                setActiveIndex((i) => Math.min(schedule.length - 1, (i ?? -1) + 1))
              } else if (e.key === "ArrowLeft") {
                setActiveIndex((i) => Math.max(0, (i ?? schedule.length) - 1))
              }
            }}
          >
            <defs>
              <linearGradient id={gridId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-principal)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="var(--chart-principal)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Gridlines + y-axis labels */}
            {yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={PAD.left}
                  x2={WIDTH - PAD.right}
                  y1={yFor(tick)}
                  y2={yFor(tick)}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
                <text
                  x={PAD.left - 10}
                  y={yFor(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {formatPrice(tick, currency).replace(/\.00$/, "")}
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {schedule.map(
              (y, i) =>
                i % xLabelStep === 0 && (
                  <text
                    key={y.year}
                    x={xFor(i)}
                    y={HEIGHT - 8}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                  >
                    Yr {y.year}
                  </text>
                )
            )}

            {/* Area wash + line */}
            <path d={areaPath} fill={`url(#${gridId})`} />
            <path d={linePath} fill="none" stroke="var(--chart-principal)" strokeWidth={2} />

            {/* Crosshair + active point */}
            {active && activeIndex !== null && (
              <g>
                <line
                  x1={xFor(activeIndex)}
                  x2={xFor(activeIndex)}
                  y1={PAD.top}
                  y2={PAD.top + plotH}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
                <circle
                  cx={xFor(activeIndex)}
                  cy={yFor(active.balance)}
                  r={5}
                  fill="var(--chart-principal)"
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              </g>
            )}
          </svg>

          {/* Tooltip */}
          {active && activeCumulative && (
            <div
              className="pointer-events-none absolute top-2 right-2 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md"
              role="status"
            >
              <p className="font-semibold text-foreground">Year {active.year}</p>
              <p className="mt-1 text-muted-foreground">
                Balance: <span className="font-medium text-foreground">{formatPrice(active.balance, currency)}</span>
              </p>
              <p className="text-muted-foreground">
                Principal paid to date:{" "}
                <span className="font-medium text-foreground">
                  {formatPrice(activeCumulative.principal, currency)}
                </span>
              </p>
              <p className="text-muted-foreground">
                Interest paid to date:{" "}
                <span className="font-medium text-foreground">
                  {formatPrice(activeCumulative.interest, currency)}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
