"use client"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { API } from "@/lib/api"
import { Skeleton } from "../ui/skeleton"
import { useRouter } from "next/navigation"

export function LatestTaskList() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter();


  useEffect(() => {

    async function fetchTasks() {
      try {
        const res = await API.get("/tasks?limit=3")
        setTasks(res.data.results)
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])


  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Latest Tasks</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              onClick={() => router.push(`/tasks/${task.id}`)}
              key={task.id}
              className="flex items-center justify-between border rounded p-3 cursor-pointer"
            >
              <span>{task.title}</span>
              <Badge variant={getBadgeVariant(task.status)} className="capitalize">
                {task.status}
              </Badge>
            </div>
          ))
        ) : (
          <div>No Task Found</div>
        )}
      </CardContent>
    </Card>
  )
}

export function getBadgeVariant(status: string) {
  switch (status) {
    case "queued":
      return "secondary"
    case "processing":
      return "outline"
    case "completed":
      return "default"
    case "failed":
      return "destructive"
    default:
      return "secondary"
  }
}
