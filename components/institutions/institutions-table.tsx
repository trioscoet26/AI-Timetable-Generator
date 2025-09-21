"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Institution } from "@/lib/types/timetable"

export function InstitutionsTable() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstitutions()
  }, [])

  const fetchInstitutions = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("institutions").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching institutions:", error)
    } else {
      setInstitutions(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-4">Loading institutions...</div>
  }

  if (institutions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No institutions found. Create your first institution to get started.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {institutions.map((institution) => (
          <TableRow key={institution.id}>
            <TableCell className="font-medium">{institution.name}</TableCell>
            <TableCell className="text-muted-foreground">{institution.address || "Not specified"}</TableCell>
            <TableCell>
              <div className="space-y-1">
                {institution.contact_email && (
                  <Badge variant="outline" className="text-xs">
                    {institution.contact_email}
                  </Badge>
                )}
                {institution.contact_phone && (
                  <Badge variant="outline" className="text-xs">
                    {institution.contact_phone}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(institution.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
