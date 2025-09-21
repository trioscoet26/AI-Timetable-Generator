import { createClient } from "@/lib/supabase/server"
import type { TimetableGenerationRequest, TimetableGenerationResult } from "@/lib/types/timetable"

export async function generateTimetable(request: TimetableGenerationRequest): Promise<TimetableGenerationResult> {
  const supabase = await createClient()

  try {
    // Fetch required data from database
    const [coursesResult, facultyResult, roomsResult, timeSlotsResult] = await Promise.all([
      supabase
        .from("courses")
        .select(`
          *,
          course_faculty!inner(faculty_id, is_primary),
          departments(name, code)
        `)
        .eq("institution_id", request.institution_id)
        .eq("semester", request.semester)
        .in("id", request.courses),

      supabase
        .from("faculty")
        .select(`
          *,
          faculty_availability(time_slot_id, is_available, preference_level)
        `)
        .eq("institution_id", request.institution_id),

      supabase.from("rooms").select("*").eq("institution_id", request.institution_id),

      supabase.from("time_slots").select("*").eq("institution_id", request.institution_id).eq("is_active", true),
    ])

    if (coursesResult.error) throw coursesResult.error
    if (facultyResult.error) throw facultyResult.error
    if (roomsResult.error) throw roomsResult.error
    if (timeSlotsResult.error) throw timeSlotsResult.error

    // Transform data for Python algorithm
    const algorithmData = {
      algorithm: request.algorithm,
      courses:
        coursesResult.data?.map((course) => ({
          id: course.id,
          course_code: course.course_code,
          course_name: course.course_name,
          credits: course.credits,
          semester: course.semester,
          course_type: course.course_type,
          faculty_id: course.course_faculty?.[0]?.faculty_id,
          required_room_type: course.course_type === "practical" ? "laboratory" : "lecture_hall",
          min_capacity: 30, // Default minimum capacity
        })) || [],

      faculty:
        facultyResult.data?.map((faculty) => ({
          id: faculty.id,
          name: faculty.name,
          department_id: faculty.department_id,
          max_hours_per_week: faculty.max_hours_per_week,
          specialization: faculty.specialization,
          availability:
            faculty.faculty_availability?.reduce((acc: Record<string, number>, avail: any) => {
              if (avail.is_available) {
                acc[avail.time_slot_id] = avail.preference_level
              }
              return acc
            }, {}) || {},
        })) || [],

      rooms:
        roomsResult.data?.map((room) => ({
          id: room.id,
          room_number: room.room_number,
          capacity: room.capacity,
          room_type: room.room_type,
          equipment: room.equipment,
        })) || [],

      time_slots:
        timeSlotsResult.data?.map((slot) => ({
          id: slot.id,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          slot_name: slot.slot_name,
        })) || [],
    }

    // Call Python algorithm (this would typically be done via API call or subprocess)
    // For now, we'll simulate the response
    const result: TimetableGenerationResult = {
      success: true,
      algorithm: request.algorithm,
      schedule: [],
      metrics: {
        faculty_workload: {
          average_hours: 0,
          max_hours: 0,
          min_hours: 0,
          workload_variance: 0,
        },
        room_utilization: {
          total_rooms_used: 0,
          average_usage: 0,
          max_usage: 0,
        },
        time_distribution: {
          total_slots_used: 0,
          average_classes_per_slot: 0,
        },
        overall_score: 0,
      },
      total_courses: algorithmData.courses.length,
      scheduled_courses: 0,
      success_rate: 0,
    }

    return result
  } catch (error) {
    console.error("Error generating timetable:", error)
    return {
      success: false,
      algorithm: request.algorithm,
      schedule: [],
      metrics: {
        faculty_workload: { average_hours: 0, max_hours: 0, min_hours: 0, workload_variance: 0 },
        room_utilization: { total_rooms_used: 0, average_usage: 0, max_usage: 0 },
        time_distribution: { total_slots_used: 0, average_classes_per_slot: 0 },
        overall_score: 0,
      },
      total_courses: 0,
      scheduled_courses: 0,
      success_rate: 0,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function saveTimetable(
  institutionId: string,
  name: string,
  academicYear: string,
  semester: number,
  generationResult: TimetableGenerationResult,
) {
  const supabase = await createClient()

  try {
    // Create timetable record
    const { data: timetable, error: timetableError } = await supabase
      .from("timetables")
      .insert({
        institution_id: institutionId,
        name,
        academic_year: academicYear,
        semester,
        status: "draft",
        generated_by: generationResult.algorithm,
        generation_metadata: {
          metrics: generationResult.metrics,
          success_rate: generationResult.success_rate,
          total_courses: generationResult.total_courses,
          scheduled_courses: generationResult.scheduled_courses,
        },
      })
      .select()
      .single()

    if (timetableError) throw timetableError

    // Create timetable entries
    if (generationResult.schedule.length > 0) {
      const entries = generationResult.schedule.map((entry) => ({
        timetable_id: timetable.id,
        course_id: entry.course_id,
        faculty_id: entry.faculty_id,
        room_id: entry.room_id,
        time_slot_id: entry.time_slot_id,
        entry_type: "regular" as const,
      }))

      const { error: entriesError } = await supabase.from("timetable_entries").insert(entries)

      if (entriesError) throw entriesError
    }

    return { success: true, timetable_id: timetable.id }
  } catch (error) {
    console.error("Error saving timetable:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
