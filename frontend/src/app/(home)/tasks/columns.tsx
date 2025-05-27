"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { getBadgeVariant } from "@/components/dashboard/TaskList"
import { Badge } from "@/components/ui/badge"

export type Task = {
    id: string
    title: string
    status: "queued" | "processing" | "completed" | "failed"
    createdAt: string
}

export const columns: ColumnDef<Task>[] = [
    {
        id: "No.",
        header: "No.",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={getBadgeVariant(row.getValue("status"))} className="capitalize">{row.getValue("status")}</Badge>
        ),
    },
    // {
    //     accessorKey: "createdAt",
    //     header: "Created At",
    // },
    {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
            <Button variant="ghost" size="icon">
                <IconTrash className="w-4 h-4 text-red-500" />
                <span className="sr-only">Delete</span>
            </Button>
        ),
    },
]
