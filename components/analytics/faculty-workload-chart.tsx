"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { createClient } from "@/lib/supabase/client"

interface FacultyWorkloadData {
  name: string
  employee_id: string
  department: string
  assigned_hours: number
  max_hours: number
  workload_percentage: number
  course_count: number
}

export function FacultyWorkloadChart() {
  const [data, setData] = useState<FacultyWorkloadData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFacultyWorkload()
  }, [])

  const fetchFacultyWorkload = async () => {
    const supabase = createClient()

    // Fetch faculty with department info
    const { data: faculty, error: facultyError } = await supabase.from("faculty").select(`
      id,
      name,
      employee_id,
      max_hours_per_week,
      departments (
        code
      )
    `)

    if (facultyError) {
      console.error("Error fetching faculty:", facultyError)
      setLoading(false)
      return
    }

    // Fetch timetable entries to calculate workload
    const { data: entries, error: entriesError } = await supabase.from("timetable_entries").select(`
      faculty_id,
      course_id,
      time_slot:time_slots (
        start_time,
        end_time
      )
    `)

    if (entriesError) {
      console.error("Error fetching timetable entries:", entriesError)
      setLoading(false)
      return
    }

    // Calculate workload for each faculty member
    const workloadData = faculty?.map((member) => {
      const memberEntries = entries?.filter((entry) => entry.faculty_id === member.id) || []
      const assignedHours = memberEntries.reduce((sum, entry) => {
        const start = new Date(`1970-01-01T${entry.time_slot.start_time}`)
        const end = new Date(`1970-01-01T${entry.time_slot.end_time}`)
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        return sum + hours
      }, 0)

      const workloadPercentage = Math.round((assignedHours / member.max_hours_per_week) * 100)
      const uniqueCourses = new Set(memberEntries.map((entry) => entry.course_id)).size

      return {
        name: member.name,
        employee_id: member.employee_id,
        department: member.departments.code,
        assigned_hours: Math.round(assignedHours * 10) / 10, // Round to 1 decimal
        max_hours: member.max_hours_per_week,
        workload_percentage: Math.min(workloadPercentage, 150), // Cap at 150% for display
        course_count: uniqueCourses,
      }
    })

    setData(workloadData || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Faculty Workload</CardTitle>
          <CardDescription>Loading faculty workload data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faculty Workload Analysis</CardTitle>
        <CardDescription>Weekly teaching hours and workload distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="employee_id"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === "workload_percentage" ? `${value}%` : `${value}`,
                name === "workload_percentage"
                  ? "Workload %"
                  : name === "assigned_hours"
                    ? "Assigned Hours"
                    : name === "max_hours"
                      ? "Max Hours"
                      : "Courses",
              ]}
              labelFormatter={(label) => {
                const faculty = data.find((f) => f.employee_id === label)
                return faculty ? `${faculty.name} (${faculty.department})` : label
              }}
            />
            <Legend />
            <Bar dataKey="assigned_hours" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Assigned Hours" />
            <Bar dataKey="max_hours" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Max Hours" />
            <Bar dataKey="course_count" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Course Count" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
