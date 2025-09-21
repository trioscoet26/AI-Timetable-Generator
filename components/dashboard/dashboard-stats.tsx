import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, MapPin, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export async function DashboardStats() {
  const supabase = await createClient()

  // Fetch stats from database
  const [facultyCount, courseCount, roomCount, timetableCount] = await Promise.all([
    supabase.from("faculty").select("id", { count: "exact", head: true }),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("rooms").select("id", { count: "exact", head: true }),
    supabase.from("timetables").select("id", { count: "exact", head: true }),
  ])

  const stats = [
    {
      title: "Total Faculty",
      value: facultyCount.count || 0,
      icon: Users,
      description: "Active faculty members",
    },
    {
      title: "Total Courses",
      value: courseCount.count || 0,
      icon: GraduationCap,
      description: "Available courses",
    },
    {
      title: "Total Rooms",
      value: roomCount.count || 0,
      icon: MapPin,
      description: "Available rooms",
    },
    {
      title: "Generated Timetables",
      value: timetableCount.count || 0,
      icon: Calendar,
      description: "Total timetables created",
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
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
