"use client"

import { RemainCreditCard } from "@/components/dashboard/RemainCreditCard"
import { LatestTaskList } from "@/components/dashboard/TaskList"
import { InsufficientCreditDialog } from "@/components/dialogs/InsufficientCreditDialog"
import { RootState } from "@/store/store"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"



export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user)
  const [showCreditDialog, setShowCreditDialog] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const display = isMounted && user

  useEffect(() => {
    if (user && user.credits === 0) {
      setShowCreditDialog(true)
    }
  }, [user])


  return (
    <div className="flex flex-1 flex-col">
      {display ? <div className="@container/main flex flex-1 flex-col gap-2 md:gap-6 px-4 ">
        <RemainCreditCard />
        <LatestTaskList />
      </div> : <></>}
      {showCreditDialog && (
        <InsufficientCreditDialog open onClose={() => setShowCreditDialog(false)} />
      )}
    </div>
  )
}