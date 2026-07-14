import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginForm } from "@/features/auth/components/LoginForm"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your UrbanKey account.",
}

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-1 font-serif text-2xl font-semibold text-foreground">Welcome back</h1>
      <p className="mb-6 text-sm text-muted-foreground">Sign in to your account to continue.</p>
      {/* Suspense required because LoginForm calls useSearchParams */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  )
}
