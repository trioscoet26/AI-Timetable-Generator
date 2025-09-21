"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar, BookOpen } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Student, Department } from "@/lib/types/timetable"
import Link from "next/link"

interface StudentWithDepartment extends Student {
  departments: Department
}

export function StudentsTable() {
  const [students, setStudents] = useState<StudentWithDepartment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("students")
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
      console.error("Error fetching students:", error)
    } else {
      setStudents(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-4">Loading students...</div>
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No students found. Add your first student to get started.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Student ID</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Semester</TableHead>
          <TableHead>Batch Year</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>
              <div>
                <div className="font-medium">{student.name}</div>
                <div className="text-sm text-muted-foreground">{student.email}</div>
              </div>
            </TableCell>
            <TableCell className="font-mono text-sm">{student.student_id}</TableCell>
            <TableCell>
              <Badge variant="outline">{student.departments.code}</Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">Semester {student.semester}</Badge>
            </TableCell>
            <TableCell className="text-center">{student.batch_year}</TableCell>
            <TableCell className="text-muted-foreground text-sm">{student.phone || "Not provided"}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/students/${student.id}/courses`}>
                    <BookOpen className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/students/${student.id}/schedule`}>
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
