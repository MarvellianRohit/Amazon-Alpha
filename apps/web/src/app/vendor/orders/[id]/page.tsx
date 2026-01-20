
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Printer, Truck, CheckCircle } from "lucide-react"
import Link from "next/link"
import { PRODUCTS } from "@/lib/mock-data"

export default async function VendorOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // Mock data for this specific view
    const { id } = await params
    const orderId = id || "10234"
    const items = PRODUCTS.slice(0, 2)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="container mx-auto max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <Link href="/vendor/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" /> Print Packing Slip</Button>
                        <Button size="sm"><Truck className="mr-2 h-4 w-4" /> Mark as Shipped</Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>Order #{orderId}</CardTitle>
                                        <CardDescription>Placed on Oct 24, 2026 at 10:32 AM</CardDescription>
                                    </div>
                                    <Badge>Processing</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start border-b last:border-0 pb-4 last:pb-0">
                                            <div className="flex gap-4">
                                                <div className="h-16 w-16 bg-slate-100 rounded-md overflow-hidden relative">
                                                    <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">Qty: 1</p>
                                                </div>
                                            </div>
                                            <p className="font-medium">${item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 dark:bg-slate-900/50 flex justify-between p-6">
                                <span className="font-medium">Total</span>
                                <span className="font-bold text-lg">$649.98</span>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Customer Details</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-4">
                                <div>
                                    <p className="font-medium">John Doe</p>
                                    <p className="text-muted-foreground">john.doe@example.com</p>
                                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="font-medium mb-1">Shipping Address</p>
                                    <p className="text-muted-foreground">
                                        123 Innovation Dr.<br />
                                        Tech City, CA 94043<br />
                                        United States
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
