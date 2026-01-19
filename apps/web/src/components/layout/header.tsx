"use client"

import Link from 'next/link'
import { useAuth } from "@/components/providers/auth-provider"
import { ShoppingCart, LogOut, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function Header() {
    const { user, signOut } = useAuth()
    const [isStudent, setIsStudent] = useState(false);

    useEffect(() => {
        // Mock check
        if (typeof window !== 'undefined') {
            setIsStudent(localStorage.getItem("is_student_verified") === "true");
        }
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md transition-all">
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-xl font-bold">Amazon-Alpha</Link>
                    {isStudent && (
                        <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
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
                        <Link href="/orders" className="text-sm font-medium hover:text-gray-600">
                            Orders
                        </Link>
                    )}

                    {user ? (
                        <>
                            <Link href="/vendor/dashboard" className="text-sm font-medium">Vendor Dashboard</Link>
                            <Button variant="ghost" onClick={signOut} size="sm">
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
