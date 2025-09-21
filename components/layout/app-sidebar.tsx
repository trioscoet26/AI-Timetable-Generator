"use client"

import {
  Calendar,
  GraduationCap,
  Users,
  Building2,
  MapPin,
  BarChart3,
  Settings,
  BookOpen,
  Clock,
  TrendingUp,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Institutions",
    url: "/institutions",
    icon: Building2,
  },
  {
    title: "Departments",
    url: "/departments",
    icon: BookOpen,
  },
  {
    title: "Faculty",
    url: "/faculty",
    icon: Users,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: GraduationCap,
  },
  {
    title: "Students",
    url: "/students",
    icon: Users,
  },
  {
    title: "Rooms",
    url: "/rooms",
    icon: MapPin,
  },
  {
    title: "Time Slots",
    url: "/time-slots",
    icon: Clock,
  },
  {
    title: "Timetables",
    url: "/timetables",
    icon: Calendar,
  },
]

const analyticsItems = [
  {
    title: "Analytics",
    url: "/analytics",
    icon: TrendingUp,
  },
]

const settingsItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <Calendar className="h-6 w-6 text-sidebar-accent" />
          <span className="font-semibold text-sidebar-foreground">Timetable AI</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
