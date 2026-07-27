export interface MortgageInput {
  homePrice: number
  downPayment: number
  interestRate: number // annual %, e.g. 6.5
  termYears: number
}

export interface MortgageResult {
  loanAmount: number
  monthlyPayment: number
  monthlyPrincipalAndInterest: number
  totalPaid: number
  totalInterest: number
}

export interface AmortizationYear {
  year: number
  principalPaid: number
  interestPaid: number
  balance: number
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const loanAmount = Math.max(0, input.homePrice - input.downPayment)
  const monthlyRate = input.interestRate / 100 / 12
  const numPayments = input.termYears * 12

  const monthlyPayment =
    numPayments <= 0
      ? 0
      : monthlyRate === 0
        ? loanAmount / numPayments
        : (loanAmount * (monthlyRate * (1 + monthlyRate) ** numPayments)) /
          ((1 + monthlyRate) ** numPayments - 1)

  const totalPaid = monthlyPayment * numPayments
  const totalInterest = Math.max(0, totalPaid - loanAmount)

  return {
    loanAmount,
    monthlyPayment,
    monthlyPrincipalAndInterest: monthlyPayment,
    totalPaid,
    totalInterest,
  }
}

/**
 * Yearly-aggregated amortization schedule. Computed month-by-month internally
 * for accuracy, then rolled up to one point per year — 360 raw monthly points
 * is more precision than a chart or table can usefully show.
 */
export function calculateAmortizationSchedule(input: MortgageInput): AmortizationYear[] {
  const { loanAmount, monthlyPayment } = calculateMortgage(input)
  const monthlyRate = input.interestRate / 100 / 12
  const numPayments = input.termYears * 12

  const schedule: AmortizationYear[] = []
  let balance = loanAmount
  let yearPrincipal = 0
  let yearInterest = 0

  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = Math.min(balance, monthlyPayment - interestPayment)
    balance = Math.max(0, balance - principalPayment)

    yearPrincipal += principalPayment
    yearInterest += interestPayment

    if (month % 12 === 0 || month === numPayments) {
      schedule.push({
        year: Math.ceil(month / 12),
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        balance,
      })
      yearPrincipal = 0
      yearInterest = 0
    }
  }

  return schedule
}
