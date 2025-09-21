"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, MapPin, Download, Share, CheckCircle, AlertTriangle } from "lucide-react"

interface TimetableViewerProps {
  timetableId: string
  timetable?: any
}

export function TimetableViewer({ timetableId, timetable }: TimetableViewerProps) {
  const [viewMode, setViewMode] = useState("weekly")
  const [selectedWeek, setSelectedWeek] = useState("week1")

  // Mock timetable data
  const mockSchedule = {
    Monday: [
      {
        time: "09:00-10:30",
        course: "CS101 - Intro to Programming",
        instructor: "Dr. Smith",
        room: "Lab A",
        students: 45,
      },
      {
        time: "11:00-12:30",
        course: "MATH201 - Calculus II",
        instructor: "Prof. Johnson",
        room: "Room 201",
        students: 60,
      },
      { time: "14:00-15:30", course: "PHY101 - Physics I", instructor: "Dr. Brown", room: "Lab B", students: 35 },
    ],
    Tuesday: [
      { time: "09:00-10:30", course: "CS102 - Data Structures", instructor: "Dr. Wilson", room: "Lab A", students: 40 },
      {
        time: "11:00-12:30",
        course: "ENG101 - Technical Writing",
        instructor: "Prof. Davis",
        room: "Room 105",
        students: 50,
      },
      { time: "15:00-16:30", course: "CS201 - Algorithms", instructor: "Dr. Smith", room: "Lab C", students: 30 },
    ],
    Wednesday: [
      {
        time: "10:00-11:30",
        course: "MATH101 - Linear Algebra",
        instructor: "Prof. Johnson",
        room: "Room 201",
        students: 55,
      },
      {
        time: "13:00-14:30",
        course: "CS103 - Database Systems",
        instructor: "Dr. Wilson",
        room: "Lab A",
        students: 42,
      },
      { time: "15:00-16:30", course: "PHY201 - Physics II", instructor: "Dr. Brown", room: "Lab B", students: 38 },
    ],
    Thursday: [
      {
        time: "09:00-10:30",
        course: "CS104 - Software Engineering",
        instructor: "Dr. Smith",
        room: "Room 301",
        students: 48,
      },
      {
        time: "11:00-12:30",
        course: "MATH301 - Statistics",
        instructor: "Prof. Johnson",
        room: "Room 201",
        students: 52,
      },
      {
        time: "14:00-15:30",
        course: "CS202 - Machine Learning",
        instructor: "Dr. Wilson",
        room: "Lab C",
        students: 25,
      },
    ],
    Friday: [
      { time: "09:00-10:30", course: "CS105 - Web Development", instructor: "Dr. Smith", room: "Lab A", students: 35 },
      { time: "11:00-12:30", course: "PHY301 - Quantum Physics", instructor: "Dr. Brown", room: "Lab B", students: 20 },
      { time: "13:30-15:00", course: "CS301 - AI Fundamentals", instructor: "Dr. Wilson", room: "Lab C", students: 28 },
    ],
  }

  const timeSlots = ["09:00-10:30", "11:00-12:30", "13:00-14:30", "14:00-15:30", "15:00-16:30"]
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  const getClassForTimeSlot = (day: string, timeSlot: string) => {
    const daySchedule = mockSchedule[day as keyof typeof mockSchedule] || []
    return daySchedule.find((cls) => cls.time === timeSlot)
  }

  const exportTimetable = () => {
    // Mock export functionality
    console.log("Exporting timetable...")
  }

  const shareTimetable = () => {
    // Mock share functionality
    console.log("Sharing timetable...")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {timetable?.name || "Timetable Viewer"}
              </CardTitle>
              <CardDescription>Generated using {timetable?.algorithm?.toUpperCase()} algorithm</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportTimetable}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={shareTimetable}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Quality Score: {timetable?.quality_score || 92}</span>
              </div>
              {timetable?.conflicts === 0 ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">No Conflicts</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{timetable?.conflicts || 0} Conflicts</span>
                </div>
              )}
            </div>
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly View</SelectItem>
                <SelectItem value="daily">Daily View</SelectItem>
                <SelectItem value="instructor">By Instructor</SelectItem>
                <SelectItem value="room">By Room</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Complete timetable view for {timetable?.semester || "Fall 2024"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-muted font-medium text-left min-w-[120px]">Time</th>
                      {days.map((day) => (
                        <th key={day} className="border p-2 bg-muted font-medium text-center min-w-[200px]">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((timeSlot) => (
                      <tr key={timeSlot}>
                        <td className="border p-2 font-medium bg-muted/50">{timeSlot}</td>
                        {days.map((day) => {
                          const classInfo = getClassForTimeSlot(day, timeSlot)
                          return (
                            <td key={`${day}-${timeSlot}`} className="border p-2 h-24 align-top">
                              {classInfo ? (
                                <div className="bg-primary/10 border border-primary/20 rounded p-2 h-full">
                                  <div className="font-medium text-sm text-primary mb-1">{classInfo.course}</div>
                                  <div className="text-xs text-muted-foreground space-y-1">
                                    <div className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {classInfo.instructor}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {classInfo.room}
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {classInfo.students} students
                                    </Badge>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-full bg-gray-50 rounded border-dashed border-2 border-gray-200" />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts">
          <Card>
            <CardHeader>
              <CardTitle>Conflict Analysis</CardTitle>
              <CardDescription>Detected scheduling conflicts and suggested resolutions</CardDescription>
            </CardHeader>
            <CardContent>
              {timetable?.conflicts === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-green-700 mb-2">No Conflicts Detected</h3>
                  <p className="text-muted-foreground">
                    Your timetable has been successfully generated without any scheduling conflicts.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Room Conflict</h4>
                    </div>
                    <p className="text-sm text-yellow-700 mb-2">Lab A is double-booked on Tuesday 11:00-12:30</p>
                    <p className="text-xs text-yellow-600">
                      Suggestion: Move CS102 to Lab B or reschedule to different time slot
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Across 5 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Room Utilization</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">Average across all rooms</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faculty Load</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18h</div>
                <p className="text-xs text-muted-foreground">Average per faculty</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">11-12</div>
                <p className="text-xs text-muted-foreground">Most scheduled slot</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
