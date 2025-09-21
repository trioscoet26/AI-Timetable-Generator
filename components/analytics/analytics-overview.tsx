import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Calendar, MapPin, GraduationCap } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export async function AnalyticsOverview() {
  const supabase = await createClient()

  // Fetch analytics data
  const [
    facultyCount,
    studentCount,
    courseCount,
    roomCount,
    timetableCount,
    activeEnrollments,
    roomUtilization,
    facultyUtilization,
  ] = await Promise.all([
    supabase.from("faculty").select("id", { count: "exact", head: true }),
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("rooms").select("id", { count: "exact", head: true }),
    supabase.from("timetables").select("id", { count: "exact", head: true }),
    supabase.from("student_courses").select("id", { count: "exact", head: true }).eq("status", "enrolled"),
    supabase.from("timetable_entries").select("room_id", { count: "exact", head: true }),
    supabase.from("timetable_entries").select("faculty_id", { count: "exact", head: true }),
  ])

  // Calculate utilization percentages
  const roomUtilizationRate = roomCount.count ? Math.round(((roomUtilization.count || 0) / roomCount.count) * 100) : 0
  const facultyUtilizationRate = facultyCount.count
    ? Math.round(((facultyUtilization.count || 0) / facultyCount.count) * 100)
    : 0

  const stats = [
    {
      title: "Total Faculty",
      value: facultyCount.count || 0,
      change: "+12%",
      trend: "up" as const,
      icon: Users,
      description: "Active faculty members",
    },
    {
      title: "Total Students",
      value: studentCount.count || 0,
      change: "+8%",
      trend: "up" as const,
      icon: GraduationCap,
      description: "Enrolled students",
    },
    {
      title: "Active Courses",
      value: courseCount.count || 0,
      change: "+5%",
      trend: "up" as const,
      icon: Calendar,
      description: "Available courses",
    },
    {
      title: "Room Utilization",
      value: `${roomUtilizationRate}%`,
      change: "+3%",
      trend: "up" as const,
      icon: MapPin,
      description: "Average room usage",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className={`flex items-center ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stat.change}
              </div>
              <span>from last month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
