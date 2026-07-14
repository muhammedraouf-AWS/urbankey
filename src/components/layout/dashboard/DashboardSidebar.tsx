"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Heart,
  Clock,
  Search,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard",                 icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/favorites",       icon: Heart,           label: "Saved Properties" },
  { href: "/dashboard/saved-searches",  icon: Search,          label: "Saved Searches" },
  { href: "/dashboard/recently-viewed", icon: Clock,           label: "Recently Viewed" },
  { href: "/dashboard/settings",        icon: Settings,        label: "Account Settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <nav className="p-4 pt-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            My Account
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-navy text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile horizontal nav */}
      <div className="border-b border-border bg-card lg:hidden">
        <nav className="flex overflow-x-auto px-2 py-1.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-navy text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-3.5 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
