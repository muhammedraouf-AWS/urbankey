"use client"

import { useMemo, type ReactNode } from "react"
import { useForm, type UseFormRegisterReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  MortgageCalculatorSchema,
  type MortgageCalculatorInput,
} from "@/features/mortgage/schemas"
import { calculateMortgage, calculateAmortizationSchedule } from "@/lib/mortgage"
import { AmortizationChart } from "./AmortizationChart"
import { PaymentBreakdown } from "./PaymentBreakdown"
import { formatPrice } from "@/lib/utils"

interface MortgageCalculatorProps {
  initialPrice?: number
  currency?: string
}

export function MortgageCalculator({ initialPrice, currency = "USD" }: MortgageCalculatorProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<MortgageCalculatorInput>({
    resolver: zodResolver(MortgageCalculatorSchema),
    mode: "onChange",
    defaultValues: {
      homePrice: initialPrice ?? 500_000,
      downPayment: Math.round((initialPrice ?? 500_000) * 0.2),
      interestRate: 6.5,
      termYears: 30,
    },
  })

  const values = watch()

  const parsed = MortgageCalculatorSchema.safeParse(values)
  const input = parsed.success ? parsed.data : null

  const result = useMemo(() => (input ? calculateMortgage(input) : null), [input])
  const schedule = useMemo(
    () => (input ? calculateAmortizationSchedule(input) : []),
    [input]
  )

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      {/* Inputs */}
      <form noValidate className="space-y-4 lg:col-span-2">
        <Field label="Home Price" error={errors.homePrice?.message}>
          <CurrencyInput id="homePrice" register={register("homePrice")} />
        </Field>

        <Field label="Down Payment" error={errors.downPayment?.message}>
          <CurrencyInput id="downPayment" register={register("downPayment")} />
        </Field>

        <Field label="Interest Rate (%)" error={errors.interestRate?.message}>
          <input
            id="interestRate"
            type="number"
            step="0.01"
            min={0}
            max={30}
            {...register("interestRate")}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </Field>

        <Field label="Loan Term (years)" error={errors.termYears?.message}>
          <select
            id="termYears"
            {...register("termYears")}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          >
            {[10, 15, 20, 25, 30, 40].map((years) => (
              <option key={years} value={years}>
                {years} years
              </option>
            ))}
          </select>
        </Field>
      </form>

      {/* Results */}
      <div className="space-y-8 lg:col-span-3">
        {result ? (
          <>
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
              <p className="mt-1 font-serif text-4xl font-semibold text-foreground">
                {formatPrice(result.monthlyPayment, currency)}
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>

              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Loan Amount</p>
                  <p className="mt-0.5 font-medium text-foreground">
                    {formatPrice(result.loanAmount, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Interest</p>
                  <p className="mt-0.5 font-medium text-foreground">
                    {formatPrice(result.totalInterest, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Paid</p>
                  <p className="mt-0.5 font-medium text-foreground">
                    {formatPrice(result.totalPaid, currency)}
                  </p>
                </div>
              </div>

              {schedule[0] && (
                <div className="mt-6 border-t border-border pt-4">
                  <PaymentBreakdown
                    principal={schedule[0].principalPaid / 12}
                    interest={schedule[0].interestPaid / 12}
                    currency={currency}
                  />
                </div>
              )}
            </div>

            <AmortizationChart schedule={schedule} currency={currency} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Enter valid figures to see your estimate.</p>
        )}

        <p className="text-xs text-muted-foreground">
          This is an estimate for illustration purposes only and doesn&apos;t include property
          taxes, insurance, or HOA fees. Consult a lender for an accurate quote.
        </p>
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

function CurrencyInput({ id, register }: { id: string; register: UseFormRegisterReturn }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        $
      </span>
      <input
        id={id}
        type="number"
        step="1"
        min={0}
        {...register}
        className="w-full rounded-lg border border-border bg-background py-2.5 pl-7 pr-3.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
      />
    </div>
  )
}
