// TypeScript type definitions for the timetable system

export interface Institution {
  id: string
  name: string
  address?: string
  contact_email?: string
  contact_phone?: string
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  institution_id: string
  name: string
  code: string
  head_of_department?: string
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  institution_id: string
  room_number: string
  building?: string
  capacity: number
  room_type: "lecture_hall" | "laboratory" | "seminar_room" | "auditorium" | "computer_lab"
  equipment: string[]
  created_at: string
  updated_at: string
}

export interface Faculty {
  id: string
  institution_id: string
  department_id: string
  employee_id: string
  name: string
  email: string
  phone?: string
  designation?: string
  specialization: string[]
  max_hours_per_week: number
  preferred_time_slots?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  institution_id: string
  department_id: string
  course_code: string
  course_name: string
  credits: number
  semester: number
  course_type: "theory" | "practical" | "tutorial" | "project"
  prerequisites: string[]
  description?: string
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  institution_id: string
  department_id: string
  student_id: string
  name: string
  email: string
  phone?: string
  semester: number
  batch_year: number
  created_at: string
  updated_at: string
}

export interface TimeSlot {
  id: string
  institution_id: string
  day_of_week: number // 1=Monday, 7=Sunday
  start_time: string
  end_time: string
  slot_name?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Timetable {
  id: string
  institution_id: string
  name: string
  academic_year: string
  semester: number
  status: "draft" | "published" | "archived"
  generated_by?: string
  generation_metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface TimetableEntry {
  id: string
  timetable_id: string
  course_id: string
  faculty_id: string
  room_id: string
  time_slot_id: string
  entry_type: "regular" | "makeup" | "extra"
  notes?: string
  created_at: string
  updated_at: string
}

export interface FacultyAvailability {
  id: string
  faculty_id: string
  time_slot_id: string
  is_available: boolean
  preference_level: number // 1-5 scale
  notes?: string
  created_at: string
  updated_at: string
}

export interface TimetableGenerationRequest {
  algorithm: "greedy" | "backtracking" | "constraint_satisfaction"
  institution_id: string
  semester: number
  academic_year: string
  courses: string[] // course IDs
  constraints?: {
    max_hours_per_day?: number
    preferred_time_ranges?: string[]
    avoid_back_to_back?: boolean
    department_clustering?: boolean
  }
}

export interface TimetableGenerationResult {
  success: boolean
  algorithm: string
  schedule: Array<{
    course_id: string
    faculty_id: string
    room_id: string
    time_slot_id: string
    conflict_score: number
  }>
  metrics: {
    faculty_workload: {
      average_hours: number
      max_hours: number
      min_hours: number
      workload_variance: number
    }
    room_utilization: {
      total_rooms_used: number
      average_usage: number
      max_usage: number
    }
    time_distribution: {
      total_slots_used: number
      average_classes_per_slot: number
    }
    overall_score: number
  }
  total_courses: number
  scheduled_courses: number
  success_rate: number
  error?: string
}

export interface TimetableView {
  id: string
  course: Course
  faculty: Faculty
  room: Room
  time_slot: TimeSlot
  department: Department
}
