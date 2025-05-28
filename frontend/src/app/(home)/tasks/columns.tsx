"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IconEye } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { getBadgeVariant } from "@/components/dashboard/TaskList"
import { Badge } from "@/components/ui/badge"
import { getImageUrl } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { DeleteTaskDialog } from "@/components/dialogs/DeleteTaskDialog"

export type Task = {
    id: string
    title: string
    status: "queued" | "processing" | "completed" | "failed"
    createdAt: string
    result_path?: string
    image_path: string
}

export const columns: ColumnDef<Task>[] = [
    {
        id: "No.",
        header: "No.",
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex
            const pageSize = table.getState().pagination.pageSize
            return pageIndex * pageSize + row.index + 1
        }
    },
    {
        accessorKey: "title",
        header: "Title",
        meta: {
            className: "text-center"
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        meta: {
            className: "text-center"
        },
        cell: ({ row }) => (
            <Badge variant={getBadgeVariant(row.getValue("status"))} className="capitalize">{row.getValue("status")}</Badge>
        ),
    },
    {
        id: "original",
        header: "Original",
        cell: ({ row }) => {
            const resultPath = row.original.image_path ?? ""
            return resultPath ? (
                <a href={getImageUrl(resultPath)} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">
                    View
                </a>
            ) : (
                <span className="text-muted-foreground text-xs">—</span>
            )
        },
        meta: {
            className: "text-center"
        }
    },
    {
        id: "result",
        header: "Result",
        cell: ({ row }) => {
            const resultPath = row.original.result_path ?? ""
            return resultPath ? (
                <a href={getImageUrl(resultPath)} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">
                    View
                </a>
            ) : (
                <span className="text-muted-foreground text-xs">—</span>
            )
        },
        meta: {
            className: "text-center"
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {

            const taskId = row.original.id
            const router = useRouter()
            return <div className="flex justify-center">
                <Button variant="ghost" size="icon" onClick={() => router.push(`/tasks/${taskId}`)}>
                    <IconEye className="w-4 h-4 text-blue-500" />
                    <span className="sr-only">View</span>
                </Button>
                <DeleteTaskDialog taskId={taskId} onSuccess={() => router.refresh()} />
            </div>
        },
    },
]
