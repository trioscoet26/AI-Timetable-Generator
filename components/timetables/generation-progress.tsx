"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Zap } from "lucide-react"

interface GenerationProgressProps {
  progress: number
  isGenerating: boolean
}

export function GenerationProgress({ progress, isGenerating }: GenerationProgressProps) {
  const steps = [
    { name: "Initializing algorithm", threshold: 14 },
    { name: "Loading constraints", threshold: 28 },
    { name: "Processing faculty availability", threshold: 42 },
    { name: "Assigning courses to time slots", threshold: 56 },
    { name: "Optimizing room allocation", threshold: 70 },
    { name: "Resolving conflicts", threshold: 84 },
    { name: "Finalizing timetable", threshold: 100 },
  ]

  const currentStep = steps.findIndex((step) => progress < step.threshold)
  const activeStepIndex = currentStep === -1 ? steps.length - 1 : Math.max(0, currentStep - 1)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Timetable Generation in Progress
          </CardTitle>
          <CardDescription>AI algorithms are working to create your optimal timetable</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = progress >= step.threshold
              const isActive = index === activeStepIndex && isGenerating
              const isPending = progress < step.threshold && index > activeStepIndex

              return (
                <div
                  key={step.name}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : isCompleted
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : isActive ? (
                      <Clock className="h-5 w-5 text-primary animate-pulse" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        isActive ? "text-primary" : isCompleted ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>

                  <div>
                    {isCompleted ? (
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    ) : isActive ? (
                      <Badge className="bg-primary/10 text-primary">In Progress</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {progress === 100 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="font-medium text-green-700">Timetable Generated Successfully!</p>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Your optimized timetable is ready for review. Switch to the viewer tab to see the results.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
