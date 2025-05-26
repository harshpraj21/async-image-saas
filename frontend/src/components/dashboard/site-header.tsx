"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { BuyCreditDialog } from "../BuyCreditDialog"

const routeMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tasks": "Tasks",
  "/profile": "Profile",
  "/tasks/create-task": "Create Task"
}

export function SiteHeader() {
  const pathname = usePathname()

  const getTitleFromPath = (path: string): string => {
    if (path.startsWith("/tasks/") && path.split("/").length === 3) {
      return "Task Details"
    }
    return routeMap[path] || "Dashboard"
  }

  const title = getTitleFromPath(pathname)

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex flex-1 justify-between items-center">
          <h1 className="text-base font-medium">{title}</h1>
          <BuyCreditDialog />
        </div>
      </div>
    </header>
  )
}
