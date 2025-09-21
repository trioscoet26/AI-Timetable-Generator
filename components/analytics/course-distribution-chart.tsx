"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { createClient } from "@/lib/supabase/client"

interface CourseDistributionData {
  name: string
  value: number
  color: string
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export function CourseDistributionChart() {
  const [data, setData] = useState<CourseDistributionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourseDistribution()
  }, [])

  const fetchCourseDistribution = async () => {
    const supabase = createClient()

    // Fetch course distribution by type
    const { data: courses, error } = await supabase.from("courses").select("course_type")

    if (error) {
      console.error("Error fetching courses:", error)
      setLoading(false)
      return
    }

    // Count courses by type
    const distribution = courses?.reduce(
      (acc, course) => {
        acc[course.course_type] = (acc[course.course_type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Convert to chart data format
    const chartData = Object.entries(distribution || {}).map(([type, count], index) => ({
      name: type,
      value: count,
      color: COLORS[index % COLORS.length],
    }))

    setData(chartData)
    setLoading(false)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Distribution</CardTitle>
          <CardDescription>Loading course distribution data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Distribution by Type</CardTitle>
        <CardDescription>Breakdown of courses by their type</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
