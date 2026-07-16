import type { Metadata } from "next"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your free UrbanKey account.",
  alternates: {
    canonical: "/register",
  },
  robots: { index: false, follow: true },
}

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-1 font-serif text-2xl font-semibold text-foreground">Create your account</h1>
      <p className="mb-6 text-sm text-muted-foreground">Join UrbanKey to save properties and more.</p>
      <RegisterForm />
    </>
  )
}
