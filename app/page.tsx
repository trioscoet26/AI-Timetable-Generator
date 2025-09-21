import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-balance">Timetable Management Dashboard</h2>
      </div>

      <div className="space-y-4">
        <DashboardStats />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <DashboardOverview />
          </div>
          <div className="col-span-3">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  )
}
