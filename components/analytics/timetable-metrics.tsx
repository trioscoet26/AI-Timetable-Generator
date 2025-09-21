import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"

export async function TimetableMetrics() {
  const supabase = await createClient()

  // Fetch timetable metrics
  const [timetables, entries, conflicts] = await Promise.all([
    supabase.from("timetables").select("id, name, status, created_at").order("created_at", { ascending: false }),
    supabase.from("timetable_entries").select("id", { count: "exact", head: true }),
    // For now, we'll simulate conflict detection
    Promise.resolve({ count: 3 }),
  ])

  const recentTimetables = timetables.data?.slice(0, 5) || []
  const totalEntries = entries.count || 0
  const conflictCount = conflicts.count || 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "secondary"
      case "archived":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timetable Metrics</CardTitle>
        <CardDescription>Current timetable status and recent activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{timetables.data?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Total Timetables</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalEntries}</div>
            <div className="text-xs text-muted-foreground">Schedule Entries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-destructive">{conflictCount}</div>
            <div className="text-xs text-muted-foreground">Conflicts</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recent Timetables</h4>
          {recentTimetables.length > 0 ? (
            <div className="space-y-2">
              {recentTimetables.map((timetable) => (
                <div key={timetable.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{timetable.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(timetable.status)} className="text-xs">
                      {timetable.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(timetable.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No timetables created yet</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
