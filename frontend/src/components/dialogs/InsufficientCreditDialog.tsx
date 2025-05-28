"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { BuyCreditDialog } from "./BuyCreditDialog"

type Props = {
  trigger?: React.ReactNode
  open?: boolean
  onClose?: () => void
}

export function InsufficientCreditDialog({ trigger, open, onClose }: Props) {
  const [isOpen, setIsOpen] = useState(open || false)

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insufficient Credits</DialogTitle>
          <DialogDescription>
            You don’t have enough credits to perform this action. Please purchase more credits to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
          <BuyCreditDialog/>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
