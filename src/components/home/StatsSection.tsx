"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap"

const stats = [
  { value: 1200, suffix: "+", label: "Properties Sold" },
  { value: 18, suffix: "", label: "Cities Covered" },
  { value: 4800, suffix: "+", label: "Happy Clients" },
  { value: 15, suffix: " yrs", label: "Market Experience" },
] as const

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([])

  useGSAP(
    () => {
      if (!sectionRef.current || prefersReducedMotion()) return

      const counters = valueRefs.current.filter(
        (el): el is HTMLSpanElement => el !== null
      )

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 0.6,
          pin: true,
        },
      })

      tl.from(sectionRef.current.querySelectorAll("[data-stat-item]"), {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        ease: "none",
      })

      counters.forEach((el, i) => {
        const target = stats[i]?.value ?? 0
        const counter = { value: 0 }
        tl.to(
          counter,
          {
            value: target,
            ease: "none",
            onUpdate: () => {
              el.textContent = Math.round(counter.value).toLocaleString()
            },
          },
          "<0.1"
        )
      })
    },
    { scope: sectionRef }
  )

  return (
    <div>
      <section
        ref={sectionRef}
        className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-[var(--navy)] px-4 py-24 text-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_oklch(0.30_0.08_255)_0%,_oklch(0.16_0.07_255)_70%)]" />

        <div className="relative z-10 w-full max-w-5xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.35em] text-[var(--gold)]">
            Trusted Nationwide
          </p>
          <h2 className="mb-14 font-serif text-3xl font-semibold text-white sm:text-4xl">
            Numbers that speak for themselves
          </h2>

          <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label} data-stat-item>
                <p className="font-serif text-4xl font-semibold text-[var(--gold)] sm:text-5xl">
                  <span ref={(el) => { valueRefs.current[i] = el }}>0</span>
                  {stat.suffix}
                </p>
                <p className="mt-2 text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
