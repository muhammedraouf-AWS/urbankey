"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, Search, Clock, ArrowRight } from "lucide-react"
import { useAuthStore } from "@/stores/auth.store"
import { useFavoritesStore } from "@/stores/favorites.store"
import { useSearchStore } from "@/stores/search.store"
import { useRecentlyViewedStore } from "@/stores/recently-viewed.store"

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const user          = useAuthStore((s) => s.user)
  const favoriteCount = useFavoritesStore((s) => s.favoriteIds.length)
  const searchCount   = useSearchStore((s) => s.recentSearches.length)
  const recentCount   = useRecentlyViewedStore((s) => s.propertyIds.length)

  const greeting = user?.firstName ? `Welcome back, ${user.firstName}` : "Welcome back"

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null

  if (!mounted) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8 h-9 w-64 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="border-b border-border bg-card px-6 py-8 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold text-foreground">{greeting}</h1>
        {memberSince && (
          <p className="mt-1 text-sm text-muted-foreground">Member since {memberSince}</p>
        )}
      </div>

      {/* Stats */}
      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            href="/dashboard/favorites"
            icon={<Heart className="size-6" />}
            label="Saved Properties"
            value={favoriteCount}
            color="text-rose-500"
          />
          <StatCard
            href="/dashboard/saved-searches"
            icon={<Search className="size-6" />}
            label="Recent Searches"
            value={searchCount}
            color="text-gold"
          />
          <StatCard
            href="/dashboard/recently-viewed"
            icon={<Clock className="size-6" />}
            label="Recently Viewed"
            value={recentCount}
            color="text-navy"
          />
        </div>

        {/* Quick actions */}
        <div className="mt-8">
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QuickAction
              href="/properties"
              title="Browse Properties"
              description="Explore all available listings"
            />
            <QuickAction
              href="/dashboard/settings"
              title="Account Settings"
              description="Update your profile and password"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  href,
  icon,
  label,
  value,
  color,
}: {
  href: string
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
    >
      <div className={`mb-3 ${color}`}>{icon}</div>
      <p className="font-serif text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        View all <ArrowRight className="size-3" />
      </div>
    </Link>
  )
}

function QuickAction({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
    >
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="size-4 text-muted-foreground" />
    </Link>
  )
}
