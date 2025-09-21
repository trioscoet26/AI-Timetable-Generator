"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Course } from "@/lib/types/timetable"

interface StudentCoursesViewProps {
  studentId: string
}

interface EnrolledCourse extends Course {
  enrollment_date: string
  status: string
}

export function StudentCoursesView({ studentId }: StudentCoursesViewProps) {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
  }, [studentId])

  const fetchCourses = async () => {
    const supabase = createClient()

    // Fetch enrolled courses
    const { data: enrolled, error: enrolledError } = await supabase
      .from("student_courses")
      .select(`
        enrollment_date,
        status,
        courses (
          id,
          course_code,
          course_name,
          credits,
          semester,
          course_type,
          description
        )
      `)
      .eq("student_id", studentId)

    if (enrolledError) {
      console.error("Error fetching enrolled courses:", enrolledError)
      return
    }

    // Get student info to filter available courses by semester
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("semester, department_id")
      .eq("id", studentId)
      .single()

    if (studentError) {
      console.error("Error fetching student info:", studentError)
      return
    }

    // Fetch available courses for the student's semester and department
    const enrolledCourseIds = enrolled?.map((e) => e.courses.id) || []
    const { data: available, error: availableError } = await supabase
      .from("courses")
      .select("*")
      .eq("department_id", student.department_id)
      .eq("semester", student.semester)
      .not("id", "in", `(${enrolledCourseIds.join(",")})`)

    if (availableError) {
      console.error("Error fetching available courses:", availableError)
      return
    }

    // Transform enrolled courses data
    const enrolledCoursesData =
      enrolled?.map((e) => ({
        ...e.courses,
        enrollment_date: e.enrollment_date,
        status: e.status,
      })) || []

    setEnrolledCourses(enrolledCoursesData)
    setAvailableCourses(available || [])
    setLoading(false)
  }

  const enrollInCourse = async (courseId: string) => {
    const supabase = createClient()

    const { error } = await supabase.from("student_courses").insert({
      student_id: studentId,
      course_id: courseId,
      status: "enrolled",
    })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to enroll in course. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Successfully enrolled in course.",
      })
      fetchCourses() // Refresh the data
    }
  }

  const dropCourse = async (courseId: string) => {
    const supabase = createClient()

    const { error } = await supabase
      .from("student_courses")
      .update({ status: "dropped" })
      .eq("student_id", studentId)
      .eq("course_id", courseId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to drop course. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Successfully dropped course.",
      })
      fetchCourses() // Refresh the data
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading courses...</div>
  }

  return (
    <Tabs defaultValue="enrolled" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="enrolled">Enrolled Courses ({enrolledCourses.length})</TabsTrigger>
        <TabsTrigger value="available">Available Courses ({availableCourses.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="enrolled" className="space-y-4">
        {enrolledCourses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{course.course_code}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {course.course_type}
                      </Badge>
                      <Badge variant={course.status === "enrolled" ? "default" : "secondary"} className="text-xs">
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm">{course.course_name}</p>
                      <p className="text-xs text-muted-foreground">{course.credits} credits</p>
                    </div>
                    {course.description && <p className="text-xs text-muted-foreground">{course.description}</p>}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Enrolled: {new Date(course.enrollment_date).toLocaleDateString()}
                      </p>
                      {course.status === "enrolled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => dropCourse(course.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Minus className="h-3 w-3 mr-1" />
                          Drop
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No courses enrolled yet. Check the Available Courses tab to enroll.
          </div>
        )}
      </TabsContent>

      <TabsContent value="available" className="space-y-4">
        {availableCourses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {availableCourses.map((course) => (
              <Card key={course.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{course.course_code}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {course.course_type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm">{course.course_name}</p>
                      <p className="text-xs text-muted-foreground">{course.credits} credits</p>
                    </div>
                    {course.description && <p className="text-xs text-muted-foreground">{course.description}</p>}
                    {course.prerequisites.length > 0 && (
                      <div>
                        <p className="text-xs font-medium">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {course.prerequisites.map((prereq, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {prereq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => enrollInCourse(course.id)}>
                        <Plus className="h-3 w-3 mr-1" />
                        Enroll
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No available courses for your current semester and department.
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
