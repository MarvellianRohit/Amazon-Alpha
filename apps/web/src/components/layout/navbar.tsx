"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, ShoppingCart, User, Bell, Package, Mic, ScanEye } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/components/providers/currency-provider";
import { SUPPORTED_CURRENCIES, CurrencyCode } from "@/lib/currencies";
import { WalletConnect } from "@/components/blockchain/wallet-connect";
import { useCart } from "@/hooks/use-cart";
import { motion } from "framer-motion";
import { useJarvis } from "@/hooks/use-jarvis";
import { VoiceOverlay } from "@/components/voice/voice-overlay";
import { CircleOverlay } from "@/components/search/circle-overlay";

// Mock Categories for Dropdown
const CATEGORIES = [
    { name: "Electronics", href: "/category/electronics" },
    { name: "Fashion", href: "/category/fashion" },
    { name: "Home & Garden", href: "/category/home" },
    { name: "Books", href: "/category/books" },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { currency, setCurrency } = useCurrency();
    const { cart } = useCart();

    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    // Jarvis Integration
    const { isListening, transcript, toggleListening } = useJarvis();

    // Circle to Search Integration
    const [isCircleOpen, setIsCircleOpen] = useState(false);

    return (
        <>
            <VoiceOverlay isOpen={isListening} transcript={transcript} onClose={toggleListening} />
            <CircleOverlay isOpen={isCircleOpen} onClose={() => setIsCircleOpen(false)} />
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 glass-panel">
                <div className="container flex h-16 items-center justify-between px-4 md:px-8">

                    {/* 1. Logo & Mobile Hamburger */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Hamburger (Visible only on small screens) */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col gap-4 mt-8">
                                    <h2 className="text-lg font-semibold">Categories</h2>
                                    <nav className="flex flex-col gap-2">
                                        {CATEGORIES.map((category) => (
                                            <Link
                                                key={category.name}
                                                href={category.href}
                                                className="text-lg font-medium hover:text-primary transition-colors"
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                    </nav>
                                    <div className="border-t my-2" />
                                    <nav className="flex flex-col gap-2">
                                        <Link href="/orders" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                                            <Package className="w-4 h-4" /> My Orders
                                        </Link>
                                        <Link href="/account" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                                            <User className="w-4 h-4" /> Account Settings
                                        </Link>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Amazon Alpha
                            </span>
                        </Link>

                        {/* Desktop Category Dropdown (Mock) */}
                        <nav className="hidden md:flex items-center gap-6 ml-6">
                            {CATEGORIES.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        pathname === category.href ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* 2. Search Bar (Adaptive) */}
                    <div className="flex-1 max-w-xl mx-4 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search products..."
                                className="pl-10 pr-10 bg-slate-100 dark:bg-slate-900 border-none focus-visible:ring-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && router.push(`/search?q=${searchQuery}`)}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 ${isListening ? "text-red-500 animate-pulse" : "text-gray-500"}`}
                                onClick={toggleListening}
                                title="Voice Search"
                            >
                                <Mic className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-indigo-500 transition-colors"
                                onClick={() => setIsCircleOpen(true)}
                                title="Circle to Search"
                            >
                                <ScanEye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* 3. Right Actions */}
                    <div className="flex items-center gap-2 lg:gap-4 ml-auto">
                        {/* Currency Selector */}
                        <div className="hidden sm:block">
                            <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
                                <SelectTrigger className="w-[90px] h-8 border-none bg-transparent focus:ring-0 text-muted-foreground hover:text-foreground">
                                    <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    {SUPPORTED_CURRENCIES.map((c) => (
                                        <SelectItem key={c.code} value={c.code}>
                                            {c.code} ({c.symbol})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Mobile Search Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Wallet Connect */}
                        <div className="hidden sm:block">
                            <WalletConnect />
                        </div>

                        {/* Desktop Profile (Always Visible) */}
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/account">
                                <User className="h-5 w-5" />
                            </Link>
                        </Button>

                        <Button variant="ghost" size="icon" asChild className="relative">
                            <Link href="/cart">
                                <motion.div
                                    key={cart?.items?.length || 0}
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                </motion.div>
                                {cart && cart.items.length > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-slate-950"
                                    >
                                        {cart.items.length}
                                    </motion.span>
                                )}
                            </Link>
                        </Button>

                        {/* Notification (Moved last) */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border-2 border-background" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Search Bar Expansion */}
                {isSearchOpen && (
                    <div className="p-4 border-t md:hidden animate-in slide-in-from-top-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full bg-slate-50 pl-8"
                                autoFocus
                            />
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
