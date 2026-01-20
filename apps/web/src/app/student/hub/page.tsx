
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, CheckCircle2, Ticket, BookOpen, Users } from "lucide-react"
import { PRODUCTS } from "@/lib/mock-data"

export default function StudentHub() {
    const studentDeals = PRODUCTS.slice(0, 3)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero */}
            <div className="bg-indigo-600 py-12 text-white">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    <div className="space-y-4">
                        <Badge className="bg-indigo-400/30 text-indigo-100 hover:bg-indigo-400/40 border-none">
                            <GraduationCap className="mr-2 h-4 w-4" /> Amazon Alpha Student
                        </Badge>
                        <h1 className="text-4xl font-bold">Welcome back, Rohit!</h1>
                        <p className="text-indigo-100 max-w-xl">
                            Your campus hub for exclusive discounts, textbooks, and community events.
                        </p>
                        <div className="flex items-center gap-2 text-sm font-medium bg-green-500/20 w-fit px-3 py-1 rounded-full text-green-100 border border-green-500/30">
                            <CheckCircle2 className="h-4 w-4" /> Verified Student Status (Expires 2026)
                        </div>
                    </div>
                    <div className="mt-8 md:mt-0 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                        <p className="font-bold mb-2">My Savings this Year</p>
                        <p className="text-4xl font-bold text-yellow-300">$342.50</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 space-y-12">

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                            <BookOpen className="h-8 w-8 text-indigo-600" />
                            <span className="font-medium">Textbooks</span>
                        </CardContent>
                    </Card>
                    <Card className="hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                            <Ticket className="h-8 w-8 text-pink-600" />
                            <span className="font-medium">Events</span>
                        </CardContent>
                    </Card>
                    <Card className="hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                            <Users className="h-8 w-8 text-blue-600" />
                            <span className="font-medium">Campus Clubs</span>
                        </CardContent>
                    </Card>
                    <Card className="hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                            <GraduationCap className="h-8 w-8 text-yellow-600" />
                            <span className="font-medium">Scholarships</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Exclusive Deals */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Student Exclusive Deals</h2>
                        <Button variant="link">View All</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {studentDeals.map((product) => (
                            <Card key={product.id}>
                                <CardHeader className="p-0">
                                    <div className="relative aspect-video bg-white dark:bg-slate-900 rounded-t-xl overflow-hidden">
                                        <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
                                        <Badge className="absolute top-2 left-2 bg-indigo-600">Student Price</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <h3 className="font-bold truncate">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-lg">${(product.price * 0.8).toFixed(2)}</span>
                                            <span className="text-xs text-muted-foreground line-through">${product.price}</span>
                                        </div>
                                        <Button size="sm">Get Offer</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Campus Events */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">Happening on Campus</h2>
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border shadow-sm flex flex-col md:flex-row gap-6">
                        <div className="h-48 w-full md:w-64 bg-slate-200 rounded-lg flex-shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                Hackathon 2026
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Badge variant="outline" className="mb-2">Tech</Badge>
                                <h3 className="text-xl font-bold">Annual University Hackathon</h3>
                                <p className="text-muted-foreground">Join over 500 students in building the next big thing. Sponsored by Amazon Alpha.</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-1"><Users className="w-4 h-4" /> 120 Registered</div>
                                <div className="flex items-center gap-1"><Ticket className="w-4 h-4" /> Free Entry</div>
                            </div>
                            <Button>Register Now</Button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}
