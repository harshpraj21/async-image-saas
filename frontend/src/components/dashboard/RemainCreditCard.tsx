"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { RootState } from "@/store/store";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import { Skeleton } from "../ui/skeleton";

export function RemainCreditCard() {
    const user = useSelector((state: RootState) => state.auth.user)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const display = isMounted && user
    return (
        <Card className="@container/card mt-4">
            {display ? <>
                <CardHeader>
                    <CardDescription className="mb-1">Remaining Credits</CardDescription>
                    <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {user?.credits}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                    Use your credits to process image tasks. You can top up anytime.
                </CardFooter>
            </> : (
                <Skeleton className="h-8 w-8 rounded-lg" >
                    <div className="grid flex-1 gap-1">
                        <Skeleton className="h-4 w-3/4 rounded" />
                        <Skeleton className="h-3 w-1/2 rounded" />
                    </div>
                </Skeleton>
            )
            }
        </Card >
    )
}
