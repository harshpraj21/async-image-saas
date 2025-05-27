"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { IconTrash } from "@tabler/icons-react"

type Task = {
    id: string
    title?: string
    image_path: string
    result_path?: string
    status: "queued" | "processing" | "completed" | "failed"
    task_metadata?: Record<string, any>
    created_at: string
}

export default function TaskDetailPage() {
    const { id } = useParams()
    const [task, setTask] = useState<Task >({
        "id": "631db470-ffac-11ee-9402-0242ac120002",
        "title": "Grayscale Portrait",
        "image_path": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop",
        "status": "completed",
        "task_metadata": {
            "operation": "grayscale",
            "user_id": "user_123",
            "priority": "normal"
        },
        "created_at": "2024-05-20T14:32:00Z",
        "result_path": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop"
    }
    )


    return (
        <div className="space-y-4 p-4">
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="flex justify-between items-center w-full">
                        <span>{task.title || "Untitled Task"}</span>
                        <div className="flex items-center gap-2">
                            <Badge className="capitalize">{task.status}</Badge>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    // TODO: Confirm + call DELETE API
                                    console.log("Delete task", task.id)
                                }}
                            >
                                <IconTrash className="w-4 h-4 text-red-500" />
                                <span className="sr-only">Delete Task</span>
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">


                    <div className="flex flex-col md:flex-row gap-4">
                        <div>
                            <p className="text-sm font-medium">Uploaded Image</p>
                            <img src={task.image_path} alt="Uploaded" className="w-48 rounded border" />
                        </div>

                        {task.result_path && (
                            <div>
                                <p className="text-sm font-medium">Processed Result</p>
                                <img src={task.result_path} alt="Processed" className="w-48 rounded border" />
                            </div>
                        )}
                    </div>

                    {task.task_metadata && (
                        <div className="space-y-1">
                            <p className="font-medium text-sm">Metadata</p>
                            <pre className="bg-muted p-2 rounded text-xs">
                                {JSON.stringify(task.task_metadata, null, 2)}
                            </pre>
                        </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                        Created at: {new Date(task.created_at).toLocaleString()}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
