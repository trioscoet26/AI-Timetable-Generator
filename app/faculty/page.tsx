import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FacultyTable } from "@/components/faculty/faculty-table"
import { CreateFacultyDialog } from "@/components/faculty/create-faculty-dialog"

export default function FacultyPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">Faculty Management</h2>
          <p className="text-muted-foreground">Manage faculty members and their information</p>
        </div>
        <CreateFacultyDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Faculty
          </Button>
        </CreateFacultyDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Faculty Members</CardTitle>
          <CardDescription>A list of all registered faculty members in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <FacultyTable />
        </CardContent>
      </Card>
    </div>
  )
}
