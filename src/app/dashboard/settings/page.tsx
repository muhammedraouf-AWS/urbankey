"use client"

import { AccountSettingsForm } from "@/features/auth/components/AccountSettingsForm"
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm"

export default function SettingsPage() {
  return (
    <div>
      <div className="border-b border-border bg-card px-6 py-8 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold text-foreground">Account Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and security preferences
        </p>
      </div>

      <div className="p-6 lg:p-8">
        <div className="max-w-xl space-y-8">
          {/* Profile section */}
          <section>
            <h2 className="mb-1 font-serif text-xl font-semibold text-foreground">Profile</h2>
            <p className="mb-5 text-sm text-muted-foreground">
              Update your name and display name.
            </p>
            <div className="rounded-2xl border border-border bg-card p-6">
              <AccountSettingsForm />
            </div>
          </section>

          {/* Password section */}
          <section>
            <h2 className="mb-1 font-serif text-xl font-semibold text-foreground">Password</h2>
            <p className="mb-5 text-sm text-muted-foreground">
              Choose a strong password with at least 8 characters.
            </p>
            <div className="rounded-2xl border border-border bg-card p-6">
              <ChangePasswordForm />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
