import { z } from "zod"
import { isValidPhoneNumber } from "react-phone-number-input"

export const LeadSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z
    .string()
    .min(1, "Enter your phone number")
    .refine((val) => isValidPhoneNumber(val), { message: "Enter a valid phone number" }),
  email: z.string().email("Enter a valid email address"),
  notes: z.string().max(1000, "Keep notes under 1000 characters").optional(),
})

export type LeadFormValues = z.infer<typeof LeadSchema>
