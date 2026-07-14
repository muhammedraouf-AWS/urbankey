"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import { ChangePasswordSchema, type ChangePasswordFormValues } from "@/features/auth/schemas"
import { updatePassword } from "@/features/auth/services"
import { useAuthStore } from "@/stores/auth.store"

export function ChangePasswordForm() {
  const tokens = useAuthStore((s) => s.tokens)

  const [showNew,     setShowNew]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState("")
  const [success, setSuccess]         = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordSchema),
  })

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (!tokens?.token) return
    setServerError("")
    setSuccess(false)
    try {
      await updatePassword(tokens.token, data.newPassword)
      setSuccess(true)
      reset()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to update password")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">New Password</label>
        <div className="relative">
          <input
            {...register("newPassword")}
            type={showNew ? "text" : "password"}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground placeholder-muted-foreground outline-none ring-0 transition focus:border-navy focus:ring-1 focus:ring-navy"
            placeholder="Min. 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            tabIndex={-1}
          >
            {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground placeholder-muted-foreground outline-none ring-0 transition focus:border-navy focus:ring-1 focus:ring-navy"
            placeholder="Repeat new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{serverError}</p>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          <CheckCircle className="size-4 shrink-0" />
          Password updated successfully.
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Updating…" : "Update Password"}
        </button>
      </div>
    </form>
  )
}
