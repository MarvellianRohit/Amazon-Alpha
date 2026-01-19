"use client"

import { useState } from "react"
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Transaction {
    id: string
    type: "sale" | "payout"
    amount: number
    status: "completed" | "pending" | "failed"
    date: string
    customer?: string
}

const recentTransactions: Transaction[] = [
    {
        id: "TRX-9871",
        type: "sale",
        amount: 85.00,
        status: "completed",
        date: "2024-01-15",
        customer: "Alice Smith",
    },
    {
        id: "TRX-9872",
        type: "sale",
        amount: 120.50,
        status: "completed",
        date: "2024-01-15",
        customer: "Bob Jones",
    },
    {
        id: "PAY-0012",
        type: "payout",
        amount: -450.00,
        status: "completed",
        date: "2024-01-14",
    },
    {
        id: "TRX-9873",
        type: "sale",
        amount: 65.00,
        status: "pending",
        date: "2024-01-14",
        customer: "Charlie Day",
    },
    {
        id: "TRX-9874",
        type: "sale",
        amount: 210.00,
        status: "completed",
        date: "2024-01-13",
        customer: "Dana White",
    },
]

export function TransactionList() {
    const [isRequesting, setIsRequesting] = useState(false)

    const handlePayout = async () => {
        setIsRequesting(true)
        // Simulate Stripe API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsRequesting(false)
        alert("Payout requested successfully (Stripe Mock)!")
    }

    return (
        <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>
                        Recent sales and payouts from your store.
                    </CardDescription>
                </div>
                <Button
                    className="ml-auto gap-1"
                    size="sm"
                    onClick={handlePayout}
                    disabled={isRequesting}
                >
                    <Wallet className="h-4 w-4" />
                    {isRequesting ? "Requesting..." : "Request Payout"}
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden xl:table-column">
                                Type
                            </TableHead>
                            <TableHead className="hidden xl:table-column">
                                Status
                            </TableHead>
                            <TableHead className="hidden xl:table-column">
                                Date
                            </TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    <div className="font-medium">
                                        {transaction.type === "sale" ? transaction.customer : "Payout to Bank"}
                                    </div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        {transaction.type === "sale" ? "Online Purchase" : "Stripe Transfer"}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden xl:table-column">
                                    {transaction.type === "sale" ? (
                                        <Badge className="text-xs" variant="outline">
                                            Sale
                                        </Badge>
                                    ) : (
                                        <Badge className="text-xs" variant="secondary">
                                            Payout
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="hidden xl:table-column">
                                    <Badge
                                        className="text-xs"
                                        variant={transaction.status === "completed" ? "default" : "secondary"}
                                    >
                                        {transaction.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden xl:table-column">
                                    {transaction.date}
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className={transaction.type === "payout" ? "text-red-500" : "text-green-500"}>
                                        {transaction.type === "sale" ? "+" : ""}
                                        ${Math.abs(transaction.amount).toFixed(2)}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
