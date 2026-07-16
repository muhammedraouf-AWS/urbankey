import { formatPrice, formatArea } from "@/lib/utils"
import type { ProjectUnit } from "@/types/project"

interface UnitsTableProps {
  units: ProjectUnit[]
  currency: string
}

export function UnitsTable({ units, currency }: UnitsTableProps) {
  if (units.length === 0) return null

  return (
    <div>
      <h2 className="mb-4 font-serif text-xl font-semibold">Available Unit Types</h2>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Beds / Baths</th>
              <th className="px-4 py-3 font-medium">Area</th>
              <th className="px-4 py-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{unit.type}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {unit.bedrooms} bd / {unit.bathrooms} ba
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatArea(unit.area, unit.areaUnit)}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {formatPrice(unit.priceFrom, currency)}
                  {unit.priceTo > unit.priceFrom && (
                    <span className="text-muted-foreground"> – {formatPrice(unit.priceTo, currency)}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
