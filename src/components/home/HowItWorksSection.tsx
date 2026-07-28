"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { Search, CalendarCheck, FileSignature, KeyRound } from "lucide-react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

const steps = [
  {
    icon: Search,
    title: "Search",
    description: "Browse curated listings filtered to your budget, city, and must-haves.",
  },
  {
    icon: CalendarCheck,
    title: "Tour",
    description: "Book a viewing in-person or virtually with a dedicated local agent.",
  },
  {
    icon: FileSignature,
    title: "Offer",
    description: "Submit an offer with guidance on pricing and negotiation from our team.",
  },
  {
    icon: KeyRound,
    title: "Close",
    description: "Finalize paperwork and get the keys to your new property.",
  },
] as const

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current || prefersReducedMotion()) return

      const items = gsap.utils.toArray<HTMLElement>("[data-step-item]")

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 0.6,
          pin: true,
        },
      })

      items.forEach((item, i) => {
        tl.to(
          item,
          {
            opacity: 1,
            scale: 1,
            ease: "none",
          },
          i === 0 ? 0 : ">-0.05"
        )
        if (i > 0) {
          tl.to(items[i - 1] ?? item, { opacity: 0.35, scale: 0.96, ease: "none" }, "<")
        }
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[80vh] flex-col items-center justify-center bg-card px-4 py-24"
    >
      <div className="mx-auto w-full max-w-5xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.35em] text-[var(--gold)]">
          Simple Process
        </p>
        <h2 className="mb-16 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
          How it works
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              data-step-item
              className="rounded-2xl border border-border bg-background p-8 opacity-40"
              style={{ transform: "scale(0.96)" }}
            >
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--navy)]">
                <step.icon className="size-5 text-[var(--gold)]" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
                Step {i + 1}
              </p>
              <h3 className="mt-1 font-serif text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
