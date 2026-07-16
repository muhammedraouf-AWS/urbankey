import type { Metadata } from "next"
import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/layout/dashboard/DashboardSidebar"

// Every /dashboard/* page is private/user-specific — never index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="lg:flex lg:min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
