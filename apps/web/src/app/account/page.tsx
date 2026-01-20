
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Package, Wallet, Settings, LogOut, ExternalLink } from "lucide-react"
import { CURRENT_USER, RECENT_ORDERS } from "@/lib/mock-data"

export default function AccountPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="w-full md:w-64 space-y-4">
                        <Card>
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100">
                                    <Image src={CURRENT_USER.avatar} alt="Profile" fill className="object-cover" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">{CURRENT_USER.name}</h2>
                                    <p className="text-sm text-muted-foreground">{CURRENT_USER.email}</p>
                                </div>
                                <Badge variant="secondary" className="uppercase text-xs">{CURRENT_USER.role}</Badge>
                            </CardContent>
                        </Card>

                        <nav className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start font-medium bg-slate-200 dark:bg-slate-800">
                                <User className="mr-2 h-4 w-4" /> Profile
                            </Button>
                            <Button variant="ghost" className="w-full justify-start font-medium">
                                <Package className="mr-2 h-4 w-4" /> Orders
                            </Button>
                            <Button variant="ghost" className="w-full justify-start font-medium">
                                <Wallet className="mr-2 h-4 w-4" /> Wallet
                            </Button>
                            <Button variant="ghost" className="w-full justify-start font-medium">
                                <Settings className="mr-2 h-4 w-4" /> Settings
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                                <LogOut className="mr-2 h-4 w-4" /> Sign Out
                            </Button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">

                        {/* Wallet Section */}
                        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/80 text-sm font-medium mb-1">Connected Wallet</p>
                                        <p className="text-2xl font-mono font-bold tracking-tight">{CURRENT_USER.walletAddress}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/80 text-sm font-medium mb-1">Balance</p>
                                        <p className="text-2xl font-bold">{CURRENT_USER.balance}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="orders">
                            <TabsList>
                                <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                                <TabsTrigger value="digital">Digital Assets</TabsTrigger>
                            </TabsList>

                            <TabsContent value="orders" className="space-y-4">
                                <h3 className="text-lg font-bold mt-4">Order History</h3>
                                {RECENT_ORDERS.map((order) => (
                                    <Card key={order.id}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <div className="space-y-1">
                                                <CardTitle className="text-sm font-medium">Order #{order.id}</CardTitle>
                                                <CardDescription>{order.date}</CardDescription>
                                            </div>
                                            <Badge className={order.status === 'Delivered' ? 'bg-green-500' : 'bg-blue-500'}>
                                                {order.status}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center space-x-4 mt-2">
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-4">
                                                        <div className="relative w-16 h-16 border rounded bg-white">
                                                            <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{item.name}</p>
                                                            <p className="text-sm text-muted-foreground">${item.price}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                                    <p className="font-bold text-lg">${order.total}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="digital">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <Card className="overflow-hidden border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/10">
                                        <CardContent className="p-0">
                                            <div className="h-32 bg-slate-200 dark:bg-slate-800 relative">
                                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                                    NFT Preview
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold">Digital Twin #4920</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Sony WH-1000XM5 Serialized Token</p>
                                                <Button variant="outline" size="sm" className="w-full mt-3 border-purple-200 text-purple-700">
                                                    View on PolygonScan <ExternalLink className="w-3 h-3 ml-1" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
