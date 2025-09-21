import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FacultyScheduleView } from "@/components/faculty/faculty-schedule-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface FacultySchedulePageProps {
  params: Promise<{ id: string }>
}

export default async function FacultySchedulePage({ params }: FacultySchedulePageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch faculty member details
  const { data: faculty, error } = await supabase
    .from("faculty")
    .select(`
      *,
      departments (
        name,
        code
      )
    `)
    .eq("id", id)
    .single()

  if (error || !faculty) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/faculty">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Faculty
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">Faculty Schedule</h2>
          <p className="text-muted-foreground">
            Current schedule for {faculty.name} ({faculty.departments.code})
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Teaching Schedule</CardTitle>
          <CardDescription>Your assigned classes and time slots for the current semester.</CardDescription>
        </CardHeader>
        <CardContent>
          <FacultyScheduleView facultyId={id} />
        </CardContent>
      </Card>
    </div>
  )
}
