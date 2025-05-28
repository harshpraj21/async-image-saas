"use client"

import { API } from "@/lib/api"
import { useState, useEffect } from "react"
import { Task, columns } from "./columns"
import { DataTable } from "./data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"



export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [total, setTotal] = useState(0)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      console.log("Fetching");
      
      const offset = (page - 1) * pageSize
      const res = await API.get(`/tasks?limit=${pageSize}&offset=${offset}`)
      setTasks(res.data.results)
      setTotal(res.data.total)
    } catch (err) {
      console.error("Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [page])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-4 p-4">
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
      ) :
        <DataTable columns={columns} data={tasks}/>}

      {!loading && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages || 1}
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
