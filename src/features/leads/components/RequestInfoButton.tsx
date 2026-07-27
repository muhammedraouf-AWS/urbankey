"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { Mail, X, Loader2, CheckCircle2 } from "lucide-react"
import { LeadSchema, type LeadFormValues } from "@/features/leads/schemas"
import { createLead } from "@/features/leads/services"

interface RequestInfoButtonProps {
  propertyId: number
  propertyTitle: string
}

export function RequestInfoButton({ propertyId, propertyTitle }: RequestInfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Mail className="size-4" />
        Request Info
      </button>

      {isOpen && (
        <RequestInfoModal
          propertyId={propertyId}
          propertyTitle={propertyTitle}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

function RequestInfoModal({
  propertyId,
  propertyTitle,
  onClose,
}: {
  propertyId: number
  propertyTitle: string
  onClose: () => void
}) {
  const [serverError, setServerError] = useState("")
  const [success, setSuccess] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({ resolver: zodResolver(LeadSchema) })

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  const onSubmit = async (values: LeadFormValues) => {
    setServerError("")
    try {
      await createLead({ ...values, propertyId, propertyTitle })
      setSuccess(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        {success ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 className="size-12 text-gold" />
            <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
              Request sent
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks — our team will be in touch shortly about {propertyTitle}.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-xl bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="pr-8 font-serif text-lg font-semibold text-foreground">
              Request Info
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us how to reach you about {propertyTitle}.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
              <div>
                <label htmlFor="lead-name" className="mb-1.5 block text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="lead-name"
                  type="text"
                  autoComplete="name"
                  autoFocus
                  {...register("name")}
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="lead-phone" className="mb-1.5 block text-sm font-medium text-foreground">
                  Phone
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      id="lead-phone"
                      international
                      defaultCountry="US"
                      autoComplete="tel"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      className="uk-phone-input"
                    />
                  )}
                />
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="lead-email" className="mb-1.5 block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="lead-email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="lead-notes" className="mb-1.5 block text-sm font-medium text-foreground">
                  Notes <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="lead-notes"
                  rows={3}
                  {...register("notes")}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
                {errors.notes && <p className="mt-1 text-xs text-destructive">{errors.notes.message}</p>}
              </div>

              {serverError && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {isSubmitting ? "Sending…" : "Send Request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
