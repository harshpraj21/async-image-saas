"use client"

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { API } from "@/lib/api"
import { IconTrash } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


type Props = {
    taskId: string
    onSuccess?: () => void
}

export function DeleteTaskDialog({ taskId, onSuccess }: Props) {
    const router = useRouter()

    const handleDelete = async () => {
        try {
            await API.delete(`/tasks/${taskId}`)
            toast.success("Task deleted")
            if (onSuccess) onSuccess()
            else router.push("/tasks")
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Failed to delete task")
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost">
                    <IconTrash className="w-4 h-4 text-red-500" />
                    <span className="sr-only">Delete Task</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete this task. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
