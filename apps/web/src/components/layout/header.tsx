"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/components/providers/auth-provider"
import { ShoppingCart, LogOut, GraduationCap, Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCurrency } from "@/components/providers/currency-provider"
import { SUPPORTED_CURRENCIES, CurrencyCode } from "@/lib/currencies"

import { connectWallet } from "@/lib/web3"

export default function Header() {
    const { user, logout } = useAuth()
    const { currency, setCurrency } = useCurrency();
    const [isStudent, setIsStudent] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const router = useRouter();

    const handleConnectWallet = async () => {
        const address = await connectWallet();
        if (address) {
            setWalletAddress(address);
        }
    };

    useEffect(() => {
        // Mock check
        if (typeof window !== 'undefined') {
            setIsStudent(localStorage.getItem("is_student_verified") === "true");
        }
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md transition-all">
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold">Amazon-Alpha</Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center w-80 lg:w-96 relative">
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full pr-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="absolute right-3 text-muted-foreground hover:text-foreground">
                            <Search className="h-4 w-4" />
                        </button>
                    </form>

                    {isStudent && (
                        <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                            <GraduationCap className="w-3 h-3" />
                            <span>Student</span>
                        </div>
                    )}
                </div>

                <nav className="flex items-center gap-4">
                    <Link href="/cart" className="flex items-center gap-2 hover:text-gray-600">
                        <ShoppingCart className="h-5 w-5" />
                        <span>Cart</span>
                    </Link>

                    {user && (
                        <Link href="/account/wishlist" className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-gray-600 mr-2">
                            <Heart className="h-4 w-4" />
                            <span>Wishlist</span>
                        </Link>
                    )}

                    {user && (
                        <Link href="/orders" className="text-sm font-medium hover:text-gray-600">
                            Orders
                        </Link>
                    )}

                    <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
                        <SelectTrigger className="w-[80px] h-8 border-none bg-transparent focus:ring-0">
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

                    {user ? (
                        <>
                            <Link href="/vendor/dashboard" className="text-sm font-medium">Vendor Dashboard</Link>

                            {/* Wallet Connection */}
                            {walletAddress ? (
                                <div className="text-xs border px-2 py-1 rounded bg-slate-50 font-mono">
                                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                                </div>
                            ) : (
                                <Button variant="outline" size="sm" onClick={handleConnectWallet} className="gap-2">
                                    <span className="text-xs">Connect Wallet</span>
                                </Button>
                            )}

                            <Button variant="ghost" onClick={() => logout()} size="sm">
                                <LogOut className="h-4 w-4 mr-2" /> Logout
                            </Button>
                        </>
                    ) : (
                        <Link href="/auth/login">
                            <Button size="sm">Login</Button>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}
