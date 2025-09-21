import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentScheduleView } from "@/components/students/student-schedule-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface StudentSchedulePageProps {
  params: Promise<{ id: string }>
}

export default async function StudentSchedulePage({ params }: StudentSchedulePageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch student details
  const { data: student, error } = await supabase
    .from("students")
    .select(`
      *,
      departments (
        name,
        code
      )
    `)
    .eq("id", id)
    .single()

  if (error || !student) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/students">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">Student Schedule</h2>
          <p className="text-muted-foreground">
            Class schedule for {student.name} ({student.departments.code} - Semester {student.semester})
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Class Schedule</CardTitle>
          <CardDescription>Your enrolled courses and their scheduled time slots.</CardDescription>
        </CardHeader>
        <CardContent>
          <StudentScheduleView studentId={id} />
        </CardContent>
      </Card>
    </div>
  )
}
