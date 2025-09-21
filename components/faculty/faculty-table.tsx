"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Faculty, Department } from "@/lib/types/timetable"
import Link from "next/link"

interface FacultyWithDepartment extends Faculty {
  departments: Department
}

export function FacultyTable() {
  const [faculty, setFaculty] = useState<FacultyWithDepartment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFaculty()
  }, [])

  const fetchFaculty = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("faculty")
      .select(`
        *,
        departments (
          id,
          name,
          code
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching faculty:", error)
    } else {
      setFaculty(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-4">Loading faculty...</div>
  }

  if (faculty.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No faculty members found. Add your first faculty member to get started.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Employee ID</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Designation</TableHead>
          <TableHead>Specialization</TableHead>
          <TableHead>Max Hours/Week</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {faculty.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.email}</div>
              </div>
            </TableCell>
            <TableCell className="font-mono text-sm">{member.employee_id}</TableCell>
            <TableCell>
              <Badge variant="outline">{member.departments.code}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{member.designation || "Not specified"}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {member.specialization.slice(0, 2).map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
                {member.specialization.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{member.specialization.length - 2}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-center">{member.max_hours_per_week}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/faculty/${member.id}/availability`}>
                    <Clock className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/faculty/${member.id}/schedule`}>
                    <Calendar className="h-4 w-4" />
                  </Link>
                </Button>
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
