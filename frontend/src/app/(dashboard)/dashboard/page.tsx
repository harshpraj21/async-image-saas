import { RemainCreditCard } from "@/components/dashboard/RemainCreditCard"
import { TaskList } from "@/components/dashboard/TaskList"

export const metadata = {
  title: "Dashboard | Image SaaS",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 md:gap-6 px-4 ">
        <RemainCreditCard />
        <TaskList />
      </div>
    </div>
  )
}