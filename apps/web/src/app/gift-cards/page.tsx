"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, CreditCard, Mail, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

const DESIGNS = [
    { id: 'standard', name: 'Standard', color: 'bg-slate-900' },
    { id: 'birthday', name: 'Birthday', color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
    { id: 'thankyou', name: 'Thank You', color: 'bg-gradient-to-r from-emerald-400 to-cyan-400' },
    { id: 'cyber', name: 'Cyberpunk', color: 'bg-gradient-to-r from-violet-600 to-indigo-600' },
]

const AMOUNTS = [25, 50, 100, 200, 500]

export default function GiftCardsPage() {
    const [selectedDesign, setSelectedDesign] = useState(DESIGNS[0])
    const [selectedAmount, setSelectedAmount] = useState<number | null>(50)
    const [customAmount, setCustomAmount] = useState("")

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount)
        setCustomAmount("")
    }

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAmount(e.target.value)
        setSelectedAmount(null)
    }

    const currentAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0)

    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                    Give the Gift of <span className="text-indigo-600">Choice</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Digital gift cards for the future of shopping. Instantly delivered via email or blockchain key.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Preview */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="sticky top-24">
                        <motion.div
                            key={selectedDesign.id}
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className={`aspect-[1.586/1] rounded-2xl shadow-2xl ${selectedDesign.color} p-8 flex flex-col justify-between text-white relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                            <div className="flex justify-between items-start relative z-10">
                                <span className="font-bold text-lg tracking-widest">AMAZON-ALPHA</span>
                                <Gift className="w-8 h-8 opacity-80" />
                            </div>

                            <div className="relative z-10 text-center">
                                <div className="text-5xl font-black tracking-tighter">
                                    ${currentAmount || "0"}
                                </div>
                            </div>

                            <div className="flex justify-between items-end relative z-10 opacity-80 text-sm font-mono">
                                <span>XXXX-XXXX-XXXX-XXXX</span>
                                <span>GIFT CARD</span>
                            </div>
                        </motion.div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {DESIGNS.map((design) => (
                                <button
                                    key={design.id}
                                    onClick={() => setSelectedDesign(design)}
                                    className={`h-12 rounded-lg border-2 ${selectedDesign.id === design.id ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-transparent bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'} font-medium text-sm transition-all`}
                                >
                                    {design.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Configuration */}
                <div className="lg:col-span-7">
                    <Card className="border-none shadow-lg bg-white dark:bg-slate-900/50">
                        <CardHeader>
                            <CardTitle>Configure Gift Card</CardTitle>
                            <CardDescription>Customize the amount and delivery details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">

                            {/* Amount Selection */}
                            <div className="space-y-4">
                                <Label className="text-base">Select Amount</Label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                    {AMOUNTS.map((amount) => (
                                        <Button
                                            key={amount}
                                            variant={selectedAmount === amount ? "default" : "outline"}
                                            onClick={() => handleAmountSelect(amount)}
                                            className={selectedAmount === amount ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                                        >
                                            ${amount}
                                        </Button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <Input
                                        type="number"
                                        placeholder="Enter custom amount"
                                        className="pl-8"
                                        value={customAmount}
                                        onChange={handleCustomAmountChange}
                                    />
                                </div>
                            </div>

                            {/* Delivery Details */}
                            <div className="space-y-4">
                                <Label className="text-base">Delivery Details</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="recipient_email">Recipient Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input id="recipient_email" placeholder="friend@example.com" className="pl-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sender_name">Your Name</Label>
                                        <Input id="sender_name" placeholder="John Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Personal Message (Optional)</Label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Hope you enjoy this gift!"
                                    />
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter>
                            <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 text-lg font-bold shadow-xl shadow-indigo-600/20">
                                <CreditCard className="mr-2 h-5 w-5" /> Purchase Gift Card
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                {[
                    { title: "Instant Delivery", desc: "Sent via email within minutes of purchase.", icon: Mail },
                    { title: "No Expiration", desc: "Our gift cards never expire or lose value.", icon: CheckCircle2 },
                    { title: "Blockchain Verified", desc: "Every card is minted as a secure digital asset.", icon: CreditCard },
                ].map((feature, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
