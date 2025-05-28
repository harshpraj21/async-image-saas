"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RemainCreditCard } from "@/components/dashboard/RemainCreditCard"
import { BuyCreditDialog } from "@/components/BuyCreditDialog"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"


export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/avatars/shadcn.jpg" alt="User Avatar" />
              <AvatarFallback>{user?.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <RemainCreditCard />
    </div>
  )
}
