"use client";

import Link from "next/link";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/search", label: "Search", icon: Search },
        { href: "/cart", label: "Cart", icon: ShoppingCart },
        { href: "/account", label: "Account", icon: User },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 z-50 safe-area-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center relative w-full h-full space-y-1 transition-colors",
                                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-100"
                            )}
                        >
                            <motion.div
                                whileTap={{ scale: 0.8 }}
                                className="relative"
                            >
                                <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-indicator"
                                        className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"
                                    />
                                )}
                            </motion.div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-active-pill"
                                    className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-xl -z-10"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
