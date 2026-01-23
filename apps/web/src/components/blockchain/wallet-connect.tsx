"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/providers/wallet-provider"
import { Wallet, LogOut, ChevronDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function WalletConnect() {
    const { isConnected, address, balance, connect, disconnect } = useWallet()

    if (isConnected) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700">
                        <Wallet className="h-4 w-4" />
                        <span className="hidden sm:inline">{address}</span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5 text-sm">
                        <span className="text-muted-foreground">Balance:</span>
                        <div className="flex items-center gap-2 font-bold text-lg">
                            {balance} ETH
                        </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={disconnect}>
                        <LogOut className="mr-2 h-4 w-4" /> Disconnect
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <Button onClick={connect} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-md">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Connect Wallet</span>
        </Button>
    )
}
