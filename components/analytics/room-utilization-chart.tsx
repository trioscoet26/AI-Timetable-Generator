"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { createClient } from "@/lib/supabase/client"

interface RoomUtilizationData {
  room_number: string
  building: string
  capacity: number
  total_hours: number
  utilization_rate: number
}

export function RoomUtilizationChart() {
  const [data, setData] = useState<RoomUtilizationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoomUtilization()
  }, [])

  const fetchRoomUtilization = async () => {
    const supabase = createClient()

    // Fetch room utilization data
    const { data: rooms, error: roomsError } = await supabase.from("rooms").select(`
      id,
      room_number,
      building,
      capacity
    `)

    if (roomsError) {
      console.error("Error fetching rooms:", roomsError)
      setLoading(false)
      return
    }

    // Fetch timetable entries to calculate utilization
    const { data: entries, error: entriesError } = await supabase.from("timetable_entries").select(`
      room_id,
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

    // Calculate utilization for each room
    const utilizationData = rooms?.map((room) => {
      const roomEntries = entries?.filter((entry) => entry.room_id === room.id) || []
      const totalHours = roomEntries.reduce((sum, entry) => {
        const start = new Date(`1970-01-01T${entry.time_slot.start_time}`)
        const end = new Date(`1970-01-01T${entry.time_slot.end_time}`)
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        return sum + hours
      }, 0)

      // Assuming 40 hours per week as maximum utilization (8 hours * 5 days)
      const maxHours = 40
      const utilizationRate = Math.round((totalHours / maxHours) * 100)

      return {
        room_number: room.room_number,
        building: room.building,
        capacity: room.capacity,
        total_hours: totalHours,
        utilization_rate: Math.min(utilizationRate, 100),
      }
    })

    setData(utilizationData || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Room Utilization</CardTitle>
          <CardDescription>Loading room utilization data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Utilization Analysis</CardTitle>
        <CardDescription>Weekly utilization rates across all rooms</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="room_number"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === "utilization_rate" ? `${value}%` : `${value} hrs`,
                name === "utilization_rate" ? "Utilization" : "Total Hours",
              ]}
              labelFormatter={(label) => `Room: ${label}`}
            />
            <Legend />
            <Bar dataKey="utilization_rate" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Utilization Rate" />
            <Bar dataKey="total_hours" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Total Hours" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
