"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Mon",
    classes: 12,
  },
  {
    name: "Tue",
    classes: 15,
  },
  {
    name: "Wed",
    classes: 10,
  },
  {
    name: "Thu",
    classes: 14,
  },
  {
    name: "Fri",
    classes: 8,
  },
]

export function DashboardOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Class Distribution</CardTitle>
        <CardDescription>Number of classes scheduled per day this week</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Bar dataKey="classes" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
