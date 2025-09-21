"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface StudentScheduleViewProps {
  studentId: string
}

interface ScheduleEntry {
  id: string
  course: {
    id: string
    course_code: string
    course_name: string
    credits: number
    course_type: string
  }
  faculty: {
    id: string
    name: string
  }
  room: {
    id: string
    room_number: string
    building: string
    capacity: number
  }
  time_slot: {
    id: string
    day_of_week: number
    start_time: string
    end_time: string
    slot_name: string
  }
}

const DAYS = [
  { id: 1, name: "Monday", short: "Mon" },
  { id: 2, name: "Tuesday", short: "Tue" },
  { id: 3, name: "Wednesday", short: "Wed" },
  { id: 4, name: "Thursday", short: "Thu" },
  { id: 5, name: "Friday", short: "Fri" },
  { id: 6, name: "Saturday", short: "Sat" },
]

export function StudentScheduleView({ studentId }: StudentScheduleViewProps) {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedule()
  }, [studentId])

  const fetchSchedule = async () => {
    const supabase = createClient()

    // First, get the student's enrolled courses
    const { data: enrolledCourses, error: enrolledError } = await supabase
      .from("student_courses")
      .select("course_id")
      .eq("student_id", studentId)
      .eq("status", "enrolled")

    if (enrolledError) {
      console.error("Error fetching enrolled courses:", enrolledError)
      setLoading(false)
      return
    }

    if (!enrolledCourses || enrolledCourses.length === 0) {
      setSchedule([])
      setLoading(false)
      return
    }

    const courseIds = enrolledCourses.map((ec) => ec.course_id)

    // Then, get the timetable entries for those courses
    const { data, error } = await supabase
      .from("timetable_entries")
      .select(`
        id,
        course:courses (
          id,
          course_code,
          course_name,
          credits,
          course_type
        ),
        faculty:faculty (
          id,
          name
        ),
        room:rooms (
          id,
          room_number,
          building,
          capacity
        ),
        time_slot:time_slots (
          id,
          day_of_week,
          start_time,
          end_time,
          slot_name
        )
      `)
      .in("course_id", courseIds)
      .order("time_slot.day_of_week")
      .order("time_slot.start_time")

    if (error) {
      console.error("Error fetching schedule:", error)
    } else {
      setSchedule(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading schedule...</div>
  }

  if (schedule.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No classes scheduled yet. Your schedule will appear here once timetables are generated and you have enrolled
        courses.
      </div>
    )
  }

  // Group schedule by day
  const scheduleByDay = DAYS.reduce(
    (acc, day) => {
      acc[day.id] = schedule.filter((entry) => entry.time_slot.day_of_week === day.id)
      return acc
    },
    {} as Record<number, ScheduleEntry[]>,
  )

  // Calculate total credits
  const totalCredits = schedule.reduce((sum, entry) => sum + entry.course.credits, 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-sm">
          <span className="font-medium">Total Classes:</span> {schedule.length}
        </div>
        <div className="text-sm">
          <span className="font-medium">Total Credits:</span> {totalCredits}
        </div>
        <div className="text-sm">
          <span className="font-medium">Unique Courses:</span> {new Set(schedule.map((s) => s.course.id)).size}
        </div>
      </div>

      {/* Weekly Schedule */}
      {DAYS.map((day) => (
        <div key={day.id} className="space-y-3">
          <h4 className="font-semibold text-lg">{day.name}</h4>
          {scheduleByDay[day.id]?.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {scheduleByDay[day.id].map((entry) => (
                <Card key={entry.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{entry.course.course_code}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {entry.course.course_type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-sm">{entry.course.course_name}</p>
                        <p className="text-xs text-muted-foreground">{entry.course.credits} credits</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Instructor:</p>
                        <p className="text-muted-foreground">{entry.faculty.name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary" className="text-xs">
                          {entry.time_slot.start_time} - {entry.time_slot.end_time}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {entry.room.room_number}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {entry.room.building} • Capacity: {entry.room.capacity}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-4 px-4 bg-muted/50 rounded-lg">
              No classes scheduled for {day.name}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
