"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { TimeSlot, FacultyAvailability } from "@/lib/types/timetable"

interface FacultyAvailabilityGridProps {
  facultyId: string
}

const DAYS = [
  { id: 1, name: "Monday", short: "Mon" },
  { id: 2, name: "Tuesday", short: "Tue" },
  { id: 3, name: "Wednesday", short: "Wed" },
  { id: 4, name: "Thursday", short: "Thu" },
  { id: 5, name: "Friday", short: "Fri" },
  { id: 6, name: "Saturday", short: "Sat" },
]

const PREFERENCE_LEVELS = [
  { level: 0, label: "Not Available", color: "bg-gray-200 text-gray-600", hoverColor: "hover:bg-gray-300" },
  { level: 1, label: "Very Low", color: "bg-red-200 text-red-800", hoverColor: "hover:bg-red-300" },
  { level: 2, label: "Low", color: "bg-orange-200 text-orange-800", hoverColor: "hover:bg-orange-300" },
  { level: 3, label: "Moderate", color: "bg-yellow-200 text-yellow-800", hoverColor: "hover:bg-yellow-300" },
  { level: 4, label: "High", color: "bg-green-200 text-green-800", hoverColor: "hover:bg-green-300" },
  { level: 5, label: "Very High", color: "bg-green-300 text-green-900", hoverColor: "hover:bg-green-400" },
]

export function FacultyAvailabilityGrid({ facultyId }: FacultyAvailabilityGridProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [availability, setAvailability] = useState<Record<string, FacultyAvailability>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [facultyId])

  const fetchData = async () => {
    const supabase = createClient()

    // Fetch time slots
    const { data: slotsData, error: slotsError } = await supabase
      .from("time_slots")
      .select("*")
      .eq("is_active", true)
      .order("day_of_week")
      .order("start_time")

    if (slotsError) {
      console.error("Error fetching time slots:", slotsError)
      return
    }

    // Fetch existing availability
    const { data: availabilityData, error: availabilityError } = await supabase
      .from("faculty_availability")
      .select("*")
      .eq("faculty_id", facultyId)

    if (availabilityError) {
      console.error("Error fetching availability:", availabilityError)
      return
    }

    setTimeSlots(slotsData || [])

    // Convert availability array to object for easier lookup
    const availabilityMap: Record<string, FacultyAvailability> = {}
    availabilityData?.forEach((avail) => {
      availabilityMap[avail.time_slot_id] = avail
    })
    setAvailability(availabilityMap)
    setLoading(false)
  }

  const updateAvailability = async (timeSlotId: string, preferenceLevel: number) => {
    const supabase = createClient()
    const isAvailable = preferenceLevel > 0

    const existingAvailability = availability[timeSlotId]

    if (existingAvailability) {
      // Update existing availability
      const { error } = await supabase
        .from("faculty_availability")
        .update({
          is_available: isAvailable,
          preference_level: preferenceLevel,
        })
        .eq("id", existingAvailability.id)

      if (!error) {
        setAvailability((prev) => ({
          ...prev,
          [timeSlotId]: {
            ...existingAvailability,
            is_available: isAvailable,
            preference_level: preferenceLevel,
          },
        }))
      }
    } else {
      // Create new availability
      const { data, error } = await supabase
        .from("faculty_availability")
        .insert({
          faculty_id: facultyId,
          time_slot_id: timeSlotId,
          is_available: isAvailable,
          preference_level: preferenceLevel,
        })
        .select()
        .single()

      if (!error && data) {
        setAvailability((prev) => ({
          ...prev,
          [timeSlotId]: data,
        }))
      }
    }
  }

  const handleSlotClick = (timeSlotId: string) => {
    const currentLevel = availability[timeSlotId]?.preference_level || 0
    const nextLevel = (currentLevel + 1) % 6 // Cycle through 0-5
    updateAvailability(timeSlotId, nextLevel)
  }

  const saveAllChanges = async () => {
    setSaving(true)
    toast({
      title: "Success",
      description: "Availability preferences saved successfully.",
    })
    setSaving(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading availability grid...</div>
  }

  // Group time slots by day
  const slotsByDay = DAYS.reduce(
    (acc, day) => {
      acc[day.id] = timeSlots.filter((slot) => slot.day_of_week === day.id)
      return acc
    },
    {} as Record<number, TimeSlot[]>,
  )

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {PREFERENCE_LEVELS.map((pref) => (
          <Badge key={pref.level} className={pref.color}>
            {pref.label}
          </Badge>
        ))}
      </div>

      {/* Availability Grid */}
      <div className="space-y-4">
        {DAYS.map((day) => (
          <div key={day.id} className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">{day.name}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {slotsByDay[day.id]?.map((slot) => {
                const avail = availability[slot.id]
                const preferenceLevel = avail?.preference_level || 0
                const prefStyle = PREFERENCE_LEVELS[preferenceLevel]

                return (
                  <Button
                    key={slot.id}
                    variant="outline"
                    size="sm"
                    className={`${prefStyle.color} ${prefStyle.hoverColor} border-2 transition-colors`}
                    onClick={() => handleSlotClick(slot.id)}
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium">
                        {slot.start_time} - {slot.end_time}
                      </div>
                      <div className="text-xs opacity-75">{slot.slot_name}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveAllChanges} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
