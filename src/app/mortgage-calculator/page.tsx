import type { Metadata } from "next"
import { MortgageCalculator } from "@/features/mortgage/components/MortgageCalculator"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: `Mortgage Calculator — ${siteConfig.name}`,
  description: "Estimate your monthly mortgage payment, total interest, and amortization schedule.",
  alternates: {
    canonical: "/mortgage-calculator",
  },
}

export default function MortgageCalculatorPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            Mortgage Calculator
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Estimate your monthly payment and see how it breaks down over the life of the loan.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <MortgageCalculator />
      </div>
    </main>
  )
}
