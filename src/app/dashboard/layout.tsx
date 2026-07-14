import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/layout/dashboard/DashboardSidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="lg:flex lg:min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
