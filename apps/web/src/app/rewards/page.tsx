import { Navbar } from "@/components/layout/navbar";
import { SpinWheel } from "@/components/rewards/spin-wheel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Gift, Zap } from "lucide-react";

export default function RewardsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <header className="mb-12 text-center space-y-4">
                    <Badge variant="secondary" className="px-3 py-1 text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 mb-4">
                        Beta Rewards Program
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        Play to Win Big
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Spin the wheel daily for exclusive discounts, free shipping, and bonus points.
                        Level up to unlock VIP tier benefits!
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8 items-start">

                    {/* Left Column: The Wheel */}
                    <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                        <SpinWheel />
                    </div>

                    {/* Right Column: Progress & Stats */}
                    <div className="space-y-6">

                        <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-2xl">Your Level</CardTitle>
                                    <Trophy className="w-8 h-8 text-yellow-300" />
                                </div>
                                <CardDescription className="text-indigo-100">Gold Tier Member</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>2,450 XP</span>
                                    <span>3,000 XP</span>
                                </div>
                                <Progress value={82} className="h-3 bg-indigo-900/40" indicatorClassName="bg-yellow-400" />
                                <p className="text-sm text-indigo-100">550 XP needed for Platinum Status</p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Star className="w-5 h-5 text-indigo-500 fill-indigo-500" />
                                        Points
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">12,450</div>
                                    <p className="text-xs text-muted-foreground">Redeemable for $125</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                                        Streak
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">5 Days</div>
                                    <p className="text-xs text-muted-foreground">+10% XP Boost active</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {[
                                        { label: "Daily Spin Win", sub: "Won 50 Points", time: "2m ago", icon: Gift },
                                        { label: "Purchase Bonus", sub: "Order #123994", time: "4h ago", icon: Trophy },
                                        { label: "Level Up", sub: "Reached Gold Tier", time: "1d ago", icon: Star },
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-4">
                                            <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                                                <item.icon className="w-4 h-4 text-indigo-500" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{item.label}</p>
                                                <p className="text-xs text-muted-foreground">{item.sub}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{item.time}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main>
        </div>
    );
}
