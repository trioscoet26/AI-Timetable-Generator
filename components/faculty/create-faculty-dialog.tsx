"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Department } from "@/lib/types/timetable"

interface CreateFacultyDialogProps {
  children: React.ReactNode
}

export function CreateFacultyDialog({ children }: CreateFacultyDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [formData, setFormData] = useState({
    name: "",
    employee_id: "",
    email: "",
    phone: "",
    department_id: "",
    designation: "",
    specialization: "",
    max_hours_per_week: "20",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchDepartments()
    }
  }, [open])

  const fetchDepartments = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("departments").select("*").order("name")

    if (error) {
      console.error("Error fetching departments:", error)
    } else {
      setDepartments(data || [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    // Get institution_id from the first department (assuming single institution for now)
    const institution_id = departments.find((d) => d.id === formData.department_id)?.institution_id

    const facultyData = {
      ...formData,
      institution_id,
      specialization: formData.specialization
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      max_hours_per_week: Number.parseInt(formData.max_hours_per_week),
    }

    const { error } = await supabase.from("faculty").insert([facultyData])

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create faculty member. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Faculty member created successfully.",
      })
      setOpen(false)
      setFormData({
        name: "",
        employee_id: "",
        email: "",
        phone: "",
        department_id: "",
        designation: "",
        specialization: "",
        max_hours_per_week: "20",
      })
      // Refresh the page to show new faculty
      window.location.reload()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Faculty Member</DialogTitle>
          <DialogDescription>Add a new faculty member to the system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dr. John Smith"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employee_id">Employee ID *</Label>
                <Input
                  id="employee_id"
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  placeholder="EMP001"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.smith@university.edu"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1-555-0123"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Professor, Associate Professor, etc."
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Machine Learning, Database Systems, etc. (comma-separated)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_hours">Maximum Hours per Week</Label>
              <Input
                id="max_hours"
                type="number"
                min="1"
                max="40"
                value={formData.max_hours_per_week}
                onChange={(e) => setFormData({ ...formData, max_hours_per_week: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Faculty"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
