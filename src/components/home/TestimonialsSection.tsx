"use client"

import { motion, type Variants } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Urban Key made finding our first home effortless. The agent matched us with exactly what we wanted within a week.",
    name: "Sarah Chen",
    role: "Homeowner, Brooklyn",
  },
  {
    quote:
      "As an investor, I need accurate data fast. Their listings are detailed and the team is responsive around the clock.",
    name: "Marcus Reyes",
    role: "Property Investor",
  },
  {
    quote:
      "Selling our apartment through Urban Key was seamless from listing to closing. Highly recommend their team.",
    name: "Amira Haddad",
    role: "Seller, Manhattan",
  },
] as const

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export function TestimonialsSection() {
  return (
    <section className="border-t border-border bg-card py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.35em] text-[var(--gold)]">
            Testimonials
          </p>
          <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            What our clients say
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              className="rounded-2xl border border-border bg-background p-8"
            >
              <Quote className="size-6 text-[var(--gold)]" />
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-6 font-serif text-base font-semibold text-foreground">
                {t.name}
              </p>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
