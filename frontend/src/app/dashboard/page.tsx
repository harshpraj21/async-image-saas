import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { RemainCreditCard } from "@/components/dashboard/RemainCreditCard"
import { SiteHeader } from "@/components/dashboard/site-header"
import { TaskList } from "@/components/dashboard/TaskList"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardPage() {
  return (
  <SidebarProvider >
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 md:gap-6 px-4 ">
          <RemainCreditCard />
          <TaskList />
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
  )
}