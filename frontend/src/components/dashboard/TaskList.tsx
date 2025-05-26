import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const mockTasks = [
  { id: 1, title: "Sunset.jpg", status: "queued" },
  { id: 2, title: "Profile.png", status: "processing" },
  { id: 3, title: "House.jpeg", status: "completed" },
]

export function TaskList() {
  return (
    <Card className="@container/card ">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between border rounded p-3"
          >
            <span>{task.title}</span>
            <Badge variant={getBadgeVariant(task.status)} className="capitalize">{task.status}</Badge>
          </div>
        ))}
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
