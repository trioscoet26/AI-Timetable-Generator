import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { RoomUtilizationChart } from "@/components/analytics/room-utilization-chart"
import { FacultyWorkloadChart } from "@/components/analytics/faculty-workload-chart"
import { CourseDistributionChart } from "@/components/analytics/course-distribution-chart"
import { TimetableMetrics } from "@/components/analytics/timetable-metrics"
import { ScheduleConflictsReport } from "@/components/analytics/schedule-conflicts-report"

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive insights and reports for timetable management</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="workload">Workload</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AnalyticsOverview />
          <div className="grid gap-4 md:grid-cols-2">
            <CourseDistributionChart />
            <TimetableMetrics />
          </div>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-4">
          <RoomUtilizationChart />
        </TabsContent>

        <TabsContent value="workload" className="space-y-4">
          <FacultyWorkloadChart />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ScheduleConflictsReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}
