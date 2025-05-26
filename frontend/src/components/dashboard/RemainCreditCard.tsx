import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"

export function RemainCreditCard() {
    return (
        <Card className="@container/card mt-4">
            <CardHeader>
                <CardDescription className="mb-1">Remaining Credits</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    120
                </CardTitle>
            </CardHeader>
            <CardFooter className="text-sm text-muted-foreground">
                Use your credits to process image tasks. You can top up anytime.
            </CardFooter>
        </Card>
    )
}
