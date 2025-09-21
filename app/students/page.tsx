import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StudentsTable } from "@/components/students/students-table"
import { CreateStudentDialog } from "@/components/students/create-student-dialog"

export default function StudentsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">Student Management</h2>
          <p className="text-muted-foreground">Manage student records and enrollments</p>
        </div>
        <CreateStudentDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </CreateStudentDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>A list of all registered students in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <StudentsTable />
        </CardContent>
      </Card>
    </div>
  )
}
