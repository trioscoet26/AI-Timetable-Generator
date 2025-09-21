import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { InstitutionsTable } from "@/components/institutions/institutions-table"
import { CreateInstitutionDialog } from "@/components/institutions/create-institution-dialog"

export default function InstitutionsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">Institutions</h2>
          <p className="text-muted-foreground">Manage educational institutions in the system</p>
        </div>
        <CreateInstitutionDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Institution
          </Button>
        </CreateInstitutionDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Institutions</CardTitle>
          <CardDescription>A list of all registered educational institutions</CardDescription>
        </CardHeader>
        <CardContent>
          <InstitutionsTable />
        </CardContent>
      </Card>
    </div>
  )
}
