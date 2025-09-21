"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Settings, Zap } from "lucide-react"

interface TimetableGenerationFormProps {
  onGenerate: (formData: any) => void
}

export function TimetableGenerationForm({ onGenerate }: TimetableGenerationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    semester: "",
    department: "",
    algorithm: "csp",
    constraints: {
      maxDailyHours: 8,
      minBreakTime: 15,
      preferredTimeSlots: [],
      avoidBackToBack: true,
      balanceWorkload: true,
      roomPreferences: true,
    },
    priorities: {
      facultyPreferences: 0.3,
      roomOptimization: 0.2,
      studentConvenience: 0.3,
      resourceUtilization: 0.2,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onGenerate(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const algorithmInfo = {
    greedy: {
      name: "Greedy Algorithm",
      description: "Fast generation with good results. Best for simple scheduling needs.",
      time: "~30 seconds",
      quality: "Good",
    },
    backtracking: {
      name: "Backtracking Algorithm",
      description: "Thorough search for optimal solutions. Better quality but slower.",
      time: "~2-5 minutes",
      quality: "Very Good",
    },
    csp: {
      name: "Constraint Satisfaction",
      description: "Advanced AI approach handling complex constraints optimally.",
      time: "~1-3 minutes",
      quality: "Excellent",
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Basic Configuration
          </CardTitle>
          <CardDescription>Set up the basic parameters for your timetable generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Timetable Name</Label>
              <Input
                id="name"
                placeholder="e.g., Fall 2024 - Computer Science"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={formData.semester}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, semester: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fall-2024">Fall 2024</SelectItem>
                  <SelectItem value="spring-2025">Spring 2025</SelectItem>
                  <SelectItem value="summer-2024">Summer 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="computer-science">Computer Science</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Algorithm Selection
          </CardTitle>
          <CardDescription>Choose the AI algorithm for generating your timetable</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(algorithmInfo).map(([key, info]) => (
              <div
                key={key}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.algorithm === key ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, algorithm: key }))}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="algorithm"
                        value={key}
                        checked={formData.algorithm === key}
                        onChange={() => setFormData((prev) => ({ ...prev, algorithm: key }))}
                        className="text-primary"
                      />
                      <h4 className="font-medium">{info.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">{info.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{info.time}</Badge>
                    <Badge variant="secondary">{info.quality}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Constraints & Preferences</CardTitle>
          <CardDescription>Configure scheduling constraints and optimization preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="avoidBackToBack"
                checked={formData.constraints.avoidBackToBack}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    constraints: { ...prev.constraints, avoidBackToBack: !!checked },
                  }))
                }
              />
              <Label htmlFor="avoidBackToBack">Avoid back-to-back classes for faculty</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="balanceWorkload"
                checked={formData.constraints.balanceWorkload}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    constraints: { ...prev.constraints, balanceWorkload: !!checked },
                  }))
                }
              />
              <Label htmlFor="balanceWorkload">Balance faculty workload</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="roomPreferences"
                checked={formData.constraints.roomPreferences}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    constraints: { ...prev.constraints, roomPreferences: !!checked },
                  }))
                }
              />
              <Label htmlFor="roomPreferences">Consider room preferences and capacity</Label>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Optimization Priorities</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Faculty Preferences: {Math.round(formData.priorities.facultyPreferences * 100)}%</Label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.priorities.facultyPreferences}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priorities: { ...prev.priorities, facultyPreferences: Number.parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Room Optimization: {Math.round(formData.priorities.roomOptimization * 100)}%</Label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.priorities.roomOptimization}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priorities: { ...prev.priorities, roomOptimization: Number.parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Student Convenience: {Math.round(formData.priorities.studentConvenience * 100)}%</Label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.priorities.studentConvenience}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priorities: { ...prev.priorities, studentConvenience: Number.parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Resource Utilization: {Math.round(formData.priorities.resourceUtilization * 100)}%</Label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.priorities.resourceUtilization}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priorities: { ...prev.priorities, resourceUtilization: Number.parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The generation process may take several minutes depending on the complexity of constraints and chosen
          algorithm. You'll be able to monitor progress in real-time.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !formData.name || !formData.semester || !formData.department}
          className="min-w-[200px]"
        >
          {isSubmitting ? "Generating..." : "Generate Timetable"}
        </Button>
      </div>
    </form>
  )
}
