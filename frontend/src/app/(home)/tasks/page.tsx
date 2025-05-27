"use client"

import { Task, columns } from "./columns"
import { DataTable } from "./data-table"



const data: Task[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `${i + 1}`,
  title: `Image ${i + 1}`,
  status: ["queued", "processing", "completed", "failed"][i % 4] as Task["status"],
  createdAt: new Date(Date.now() - i * 3600000).toLocaleString(),
}))

export default function Tasks() {
  return (
    <div className="space-y-4 p-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
