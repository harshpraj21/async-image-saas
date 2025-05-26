"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const creditOptions = [
  { value: "50", label: "50 Credits – ₹49" },
  { value: "100", label: "100 Credits – ₹89" },
  { value: "200", label: "200 Credits – ₹169" },
]



export function BuyCreditDialog() {
  const [selected, setSelected] = useState<string | undefined>()

  const handlePurchase = () => {
    if (!selected) return
    const label = creditOptions.find((o) => o.value === selected)?.label
    alert(`Purchasing ${label}`)
    // TODO: Trigger Razorpay or backend request
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">Buy Credits</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Buy More Credits</DialogTitle>
          <DialogDescription>
            Select a package to add credits to your account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Select onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue placeholder="Choose credits" />
            </SelectTrigger>
            <SelectContent>
              {creditOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handlePurchase}
            disabled={!selected}
            className="w-full"
          >
            Confirm & Pay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
