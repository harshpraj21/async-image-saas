"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"
import { API } from "@/lib/api"
import { getImageUrl } from "@/lib/utils"
import { DeleteTaskDialog } from "@/components/dialogs/DeleteTaskDialog"

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
    const params = useParams()
    const id = typeof params.id === "string" ? params.id : ""

    const [task, setTask] = useState<Task | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return

        const fetchTask = async () => {
            try {
                const res = await API.get(`/tasks/${id}`)
                setTask(res.data)
            } catch (err: any) {
                toast.error(err?.response?.data?.detail || "Failed to load task.")
            } finally {
                setLoading(false)
            }
        }

        fetchTask()
    }, [id])



    if (loading || !task) {
        return (
            <div className="space-y-4 p-4">
                <Skeleton className="h-40 w-full rounded" />
            </div>
        )
    }

    return (
        <div className="space-y-4 p-4">
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="flex justify-between items-center w-full">
                        <span>{task.title || "Untitled Task"}</span>
                        <div className="flex items-center gap-2">
                            <Badge className="capitalize">{task.status}</Badge>
                            <DeleteTaskDialog taskId={task.id} />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-10">
                        <div>
                            <p className="text-sm font-medium py-2.5">Uploaded Image</p>
                            <img src={getImageUrl(task.image_path)} alt="Uploaded" className="w-48 rounded border" />
                        </div>

                        {task.result_path && (
                            <div>
                                <p className="text-sm font-medium py-2.5">Processed Result</p>
                                <img src={getImageUrl(task.result_path)} alt="Processed" className="w-48 rounded border" />
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