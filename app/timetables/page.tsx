"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Zap, CheckCircle, AlertCircle, Play } from "lucide-react"
import { TimetableGenerationForm } from "@/components/timetables/timetable-generation-form"
import { TimetableViewer } from "@/components/timetables/timetable-viewer"
import { GenerationProgress } from "@/components/timetables/generation-progress"

interface Timetable {
  id: string
  name: string
  semester: string
  department: string
  status: "draft" | "generating" | "completed" | "failed"
  algorithm: "greedy" | "backtracking" | "csp"
  created_at: string
  quality_score?: number
  conflicts?: number
}

export default function TimetablesPage() {
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [selectedTimetable, setSelectedTimetable] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Load existing timetables
    loadTimetables()
  }, [])

  const loadTimetables = async () => {
    // Mock data for demonstration
    const mockTimetables: Timetable[] = [
      {
        id: "1",
        name: "Fall 2024 - Computer Science",
        semester: "Fall 2024",
        department: "Computer Science",
        status: "completed",
        algorithm: "csp",
        created_at: "2024-01-15T10:30:00Z",
        quality_score: 92,
        conflicts: 0,
      },
      {
        id: "2",
        name: "Spring 2024 - Mathematics",
        semester: "Spring 2024",
        department: "Mathematics",
        status: "completed",
        algorithm: "backtracking",
        created_at: "2024-01-10T14:20:00Z",
        quality_score: 88,
        conflicts: 2,
      },
      {
        id: "3",
        name: "Fall 2024 - Physics",
        semester: "Fall 2024",
        department: "Physics",
        status: "draft",
        algorithm: "greedy",
        created_at: "2024-01-20T09:15:00Z",
      },
    ]
    setTimetables(mockTimetables)
  }

  const handleGenerateTimetable = async (formData: any) => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setActiveTab("generation")

    // Simulate timetable generation process
    const steps = [
      "Initializing algorithm...",
      "Loading constraints...",
      "Processing faculty availability...",
      "Assigning courses to time slots...",
      "Optimizing room allocation...",
      "Resolving conflicts...",
      "Finalizing timetable...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setGenerationProgress(((i + 1) / steps.length) * 100)
    }

    // Create new timetable
    const newTimetable: Timetable = {
      id: Date.now().toString(),
      name: `${formData.semester} - ${formData.department}`,
      semester: formData.semester,
      department: formData.department,
      status: "completed",
      algorithm: formData.algorithm,
      created_at: new Date().toISOString(),
      quality_score: Math.floor(Math.random() * 20) + 80,
      conflicts: Math.floor(Math.random() * 3),
    }

    setTimetables((prev) => [newTimetable, ...prev])
    setSelectedTimetable(newTimetable.id)
    setIsGenerating(false)
    setActiveTab("viewer")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "generating":
        return <Play className="h-4 w-4 text-blue-500 animate-spin" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "generating":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAlgorithmBadge = (algorithm: string) => {
    const colors = {
      greedy: "bg-orange-100 text-orange-800",
      backtracking: "bg-purple-100 text-purple-800",
      csp: "bg-blue-100 text-blue-800",
    }
    return colors[algorithm as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable Generator</h1>
          <p className="text-muted-foreground">Generate optimized timetables using AI algorithms</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="generate">Generate New</TabsTrigger>
          <TabsTrigger value="generation" disabled={!isGenerating}>
            Generation Progress
          </TabsTrigger>
          <TabsTrigger value="viewer" disabled={!selectedTimetable}>
            View Timetable
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Timetables</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{timetables.length}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{timetables.filter((t) => t.status === "completed").length}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((timetables.filter((t) => t.status === "completed").length / timetables.length) * 100)}%
                  success rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Quality Score</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    timetables.filter((t) => t.quality_score).reduce((acc, t) => acc + (t.quality_score || 0), 0) /
                      timetables.filter((t) => t.quality_score).length,
                  ) || 0}
                </div>
                <p className="text-xs text-muted-foreground">Out of 100 points</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Conflicts</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{timetables.reduce((acc, t) => acc + (t.conflicts || 0), 0)}</div>
                <p className="text-xs text-muted-foreground">Across all timetables</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Timetables</CardTitle>
              <CardDescription>Your recently generated timetables and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timetables.map((timetable) => (
                  <div
                    key={timetable.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setSelectedTimetable(timetable.id)
                      setActiveTab("viewer")
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(timetable.status)}
                      <div>
                        <h4 className="font-medium">{timetable.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Created {new Date(timetable.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getAlgorithmBadge(timetable.algorithm)}>
                        {timetable.algorithm.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(timetable.status)}>{timetable.status}</Badge>
                      {timetable.quality_score && <Badge variant="outline">Score: {timetable.quality_score}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <TimetableGenerationForm onGenerate={handleGenerateTimetable} />
        </TabsContent>

        <TabsContent value="generation">
          <GenerationProgress progress={generationProgress} isGenerating={isGenerating} />
        </TabsContent>

        <TabsContent value="viewer">
          {selectedTimetable && (
            <TimetableViewer
              timetableId={selectedTimetable}
              timetable={timetables.find((t) => t.id === selectedTimetable)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
