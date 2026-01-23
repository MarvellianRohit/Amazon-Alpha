"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Package, Wallet, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENT_USER } from "@/lib/mock-data";

const SIDEBAR_ITEMS = [
    { name: "Profile", href: "/account/profile", icon: User },
    { name: "Orders", href: "/account/orders", icon: Package },
    { name: "Wallet", href: "/account/wallet", icon: Wallet },
    { name: "Settings", href: "/account/settings", icon: Settings },
];

export function AccountSidebar() {
    const pathname = usePathname();

    return (
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
                {SIDEBAR_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start font-medium",
                                    isActive && "bg-slate-200 dark:bg-slate-800"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </Button>
                        </Link>
                    );
                })}
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
            </nav>
        </aside>
    );
}
