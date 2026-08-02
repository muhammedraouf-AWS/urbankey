"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import { ArrowRight } from "lucide-react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !imageRef.current ||
        !overlayRef.current ||
        !textRef.current ||
        prefersReducedMotion()
      )
        return

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=100%",
            scrub: 0.6,
            pin: true,
          },
        })
        .to(imageRef.current, { scale: 1.18, ease: "none" }, 0)
        .to(overlayRef.current, { opacity: 0.8, ease: "none" }, 0)
        .to(textRef.current, { y: -60, opacity: 0, ease: "none" }, 0)
    },
    { scope: sectionRef }
  )

  return (
    <div>
      <section
        ref={sectionRef}
        className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
      >
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src="/images/observation-urban-building-business-steel-copy_11zon.webp"
            alt="Urban skyline of glass skyscrapers"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-b from-[var(--navy-dark)]/80 via-[var(--navy-dark)]/68 to-[var(--navy-dark)]/88"
        />

        <div ref={textRef} className="relative z-10 max-w-4xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-[var(--gold)]">
            Premium Real Estate
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
            Find Your Perfect
            <br />
            <span className="text-[var(--gold)]">Urban Key</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Discover luxury properties, exclusive apartments, and premium
            investments curated for those who expect the extraordinary.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-8 py-3.5 text-sm font-semibold text-[var(--navy)] transition-opacity hover:opacity-90"
            >
              Browse Properties <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/properties?listingType=rent"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Properties for Rent
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
