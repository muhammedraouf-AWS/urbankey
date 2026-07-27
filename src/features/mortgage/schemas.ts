import { z } from "zod"

export const MortgageCalculatorSchema = z
  .object({
    homePrice: z.coerce
      .number({ message: "Enter a home price" })
      .min(1, "Enter a home price")
      .max(100_000_000, "Enter a realistic home price"),
    downPayment: z.coerce
      .number({ message: "Enter a down payment" })
      .min(0, "Cannot be negative"),
    interestRate: z.coerce
      .number({ message: "Enter an interest rate" })
      .min(0, "Cannot be negative")
      .max(30, "Enter a realistic rate"),
    termYears: z.coerce
      .number({ message: "Enter a loan term" })
      .int("Whole years only")
      .min(1, "Minimum 1 year")
      .max(40, "Maximum 40 years"),
  })
  .refine((d) => d.downPayment < d.homePrice, {
    message: "Down payment must be less than the home price",
    path: ["downPayment"],
  })

// react-hook-form types the form state from the *input* shape (raw values as
// typed, pre-coercion — `z.coerce.number()` accepts `unknown` here), while
// the validated/submitted result uses the *output* shape (actual numbers).
export type MortgageCalculatorInput = z.input<typeof MortgageCalculatorSchema>
export type MortgageCalculatorValues = z.infer<typeof MortgageCalculatorSchema>
