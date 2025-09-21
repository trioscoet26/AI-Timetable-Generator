import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server"

export async function RecentActivity() {
  const supabase = await createClient()

  // Fetch recent timetables
  const { data: recentTimetables } = await supabase
    .from("timetables")
    .select("name, created_at, status")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest timetable generations and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentTimetables?.map((timetable, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>TT</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{timetable.name}</p>
                <p className="text-sm text-muted-foreground">Status: {timetable.status}</p>
              </div>
              <div className="ml-auto font-medium text-sm text-muted-foreground">
                {new Date(timetable.created_at).toLocaleDateString()}
              </div>
            </div>
          )) || <div className="text-center text-muted-foreground">No recent activity</div>}
        </div>
      </CardContent>
    </Card>
  )
}
