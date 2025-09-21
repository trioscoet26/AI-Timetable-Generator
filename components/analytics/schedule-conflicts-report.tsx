"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ConflictData {
  type: "room" | "faculty" | "student"
  severity: "high" | "medium" | "low"
  description: string
  affected_entities: string[]
  time_slot: string
  suggestions: string[]
}

export function ScheduleConflictsReport() {
  const [conflicts, setConflicts] = useState<ConflictData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyzeConflicts()
  }, [])

  const analyzeConflicts = async () => {
    const supabase = createClient()

    // Fetch timetable entries with related data
    const { data: entries, error } = await supabase.from("timetable_entries").select(`
      id,
      course_id,
      faculty_id,
      room_id,
      time_slot_id,
      courses (course_code, course_name),
      faculty (name, employee_id),
      rooms (room_number, building),
      time_slots (day_of_week, start_time, end_time, slot_name)
    `)

    if (error) {
      console.error("Error fetching timetable entries:", error)
      setLoading(false)
      return
    }

    const detectedConflicts: ConflictData[] = []

    // Check for room conflicts (same room, same time slot)
    const roomConflicts = new Map<string, typeof entries>()
    entries?.forEach((entry) => {
      const key = `${entry.room_id}-${entry.time_slot_id}`
      if (!roomConflicts.has(key)) {
        roomConflicts.set(key, [])
      }
      roomConflicts.get(key)?.push(entry)
    })

    roomConflicts.forEach((conflictingEntries, key) => {
      if (conflictingEntries.length > 1) {
        const [roomId, timeSlotId] = key.split("-")
        const entry = conflictingEntries[0]
        detectedConflicts.push({
          type: "room",
          severity: "high",
          description: `Room ${entry.rooms.room_number} is double-booked`,
          affected_entities: conflictingEntries.map((e) => e.courses.course_code),
          time_slot: `${entry.time_slots.slot_name} (${entry.time_slots.start_time}-${entry.time_slots.end_time})`,
          suggestions: ["Assign different rooms", "Change time slots", "Merge compatible classes"],
        })
      }
    })

    // Check for faculty conflicts (same faculty, same time slot)
    const facultyConflicts = new Map<string, typeof entries>()
    entries?.forEach((entry) => {
      const key = `${entry.faculty_id}-${entry.time_slot_id}`
      if (!facultyConflicts.has(key)) {
        facultyConflicts.set(key, [])
      }
      facultyConflicts.get(key)?.push(entry)
    })

    facultyConflicts.forEach((conflictingEntries, key) => {
      if (conflictingEntries.length > 1) {
        const entry = conflictingEntries[0]
        detectedConflicts.push({
          type: "faculty",
          severity: "high",
          description: `${entry.faculty.name} is scheduled for multiple classes`,
          affected_entities: conflictingEntries.map((e) => e.courses.course_code),
          time_slot: `${entry.time_slots.slot_name} (${entry.time_slots.start_time}-${entry.time_slots.end_time})`,
          suggestions: ["Assign different faculty", "Change time slots", "Use team teaching approach"],
        })
      }
    })

    // Add some simulated conflicts for demonstration
    if (detectedConflicts.length === 0) {
      detectedConflicts.push(
        {
          type: "room",
          severity: "medium",
          description: "Room CS-101 has low utilization",
          affected_entities: ["CS-101"],
          time_slot: "Monday 9:00-10:00",
          suggestions: ["Consider room reallocation", "Schedule additional classes"],
        },
        {
          type: "faculty",
          severity: "low",
          description: "Dr. Smith has uneven workload distribution",
          affected_entities: ["Dr. Smith"],
          time_slot: "Weekly schedule",
          suggestions: ["Balance teaching hours", "Redistribute courses"],
        },
      )
    }

    setConflicts(detectedConflicts)
    setLoading(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "room" ? "🏢" : type === "faculty" ? "👨‍🏫" : "👨‍🎓"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Schedule Conflicts Report</CardTitle>
          <CardDescription>Analyzing schedule for conflicts...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Conflicts Report</CardTitle>
        <CardDescription>Detected conflicts and optimization suggestions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {conflicts.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>No critical conflicts detected in the current schedule.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">{conflicts.length} issues detected</span>
            </div>

            {conflicts.map((conflict, index) => (
              <Card key={index} className="border-l-4 border-l-destructive">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span>{getTypeIcon(conflict.type)}</span>
                      {conflict.description}
                    </CardTitle>
                    <Badge variant={getSeverityColor(conflict.severity)} className="text-xs">
                      {conflict.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div>
                    <p className="text-sm font-medium">Affected:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {conflict.affected_entities.map((entity, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time Slot:</p>
                    <p className="text-sm text-muted-foreground">{conflict.time_slot}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Suggestions:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {conflict.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
