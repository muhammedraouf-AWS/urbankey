"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle } from "lucide-react"
import { ProfileSchema, type ProfileFormValues } from "@/features/auth/schemas"
import { updateProfile } from "@/features/auth/services"
import { useAuthStore } from "@/stores/auth.store"

export function AccountSettingsForm() {
  const user    = useAuthStore((s) => s.user)
  const tokens  = useAuthStore((s) => s.tokens)
  const setUser = useAuthStore((s) => s.setUser)

  const [serverError, setServerError] = useState("")
  const [success, setSuccess]         = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName:   user?.firstName   ?? "",
      lastName:    user?.lastName    ?? "",
      displayName: user?.displayName ?? "",
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    if (!tokens?.token) return
    setServerError("")
    setSuccess(false)
    try {
      const updated = await updateProfile(tokens.token, data)
      setUser(updated)
      setSuccess(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to update profile")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            First Name
          </label>
          <input
            {...register("firstName")}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none ring-0 transition focus:border-navy focus:ring-1 focus:ring-navy"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Last Name
          </label>
          <input
            {...register("lastName")}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none ring-0 transition focus:border-navy focus:ring-1 focus:ring-navy"
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Display Name
        </label>
        <input
          {...register("displayName")}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none ring-0 transition focus:border-navy focus:ring-1 focus:ring-navy"
        />
        {errors.displayName && (
          <p className="mt-1 text-xs text-red-500">{errors.displayName.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Email Address
        </label>
        <input
          type="email"
          value={user?.email ?? ""}
          disabled
          className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground"
        />
        <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed here.</p>
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{serverError}</p>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          <CheckCircle className="size-4 shrink-0" />
          Profile updated successfully.
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
