"use client";

import { useState } from "react";
import { createWalletClient, custom, parseEther } from "viem";
import { mainnet } from "viem/chains";
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle, Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";

export function CryptoPayment() {
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [txnHash, setTxnHash] = useState("");
    const [address, setAddress] = useState("");

    const connectWallet = async () => {
        if (typeof window === "undefined" || !(window as any).ethereum) {
            toast.error("No crypto wallet found", {
                description: "Please install MetaMask or another Web3 wallet."
            });
            return;
        }

        setLoading(true);
        try {
            const client = createWalletClient({
                chain: mainnet,
                transport: custom((window as any).ethereum)
            });

            const [account] = await client.requestAddresses();
            setAddress(account);
            setConnected(true);
            toast.success("Wallet Connected!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to connect wallet");
        } finally {
            setLoading(false);
        }
    };

    const payNow = async () => {
        if (!address) return;
        setLoading(true);

        // Simulation of a payment since we can't easily do real money on local
        setTimeout(() => {
            setTxnHash("0x7f9...3a2"); // Mock hash
            setLoading(false);
            toast.success("Payment Successful!", {
                description: "Transaction ID: 0x7f9...3a2"
            });
        }, 2000);

        /* Real implementation code (commented for safety)
        try {
            const client = createWalletClient({ chain: mainnet, transport: custom((window as any).ethereum) });
            const hash = await client.sendTransaction({ 
                account: address as `0x${string}`,
                to: '0x...', 
                value: parseEther('0.01')
            });
            setTxnHash(hash);
        } catch(e) { ... }
        */
    };

    if (!connected) {
        return (
            <Button onClick={connectWallet} disabled={loading} className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wallet className="w-4 h-4 mr-2" />}
                Connect Wallet (ETH/USDC)
            </Button>
        );
    }

    return (
        <div className="border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white">
                        <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold">Web3 Pay</div>
                        <div className="text-xs text-muted-foreground">{address.slice(0, 6)}...{address.slice(-4)}</div>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setConnected(false)} className="text-xs">Disconnect</Button>
            </div>

            {txnHash ? (
                <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-lg flex flex-col items-center text-center">
                    <CheckCircle className="w-8 h-8 mb-2" />
                    <div className="font-bold">Payment Complete</div>
                    <div className="text-xs mt-1">Ref: {txnHash}</div>
                </div>
            ) : (
                <Button onClick={payNow} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    {loading ? "Processing..." : "Pay 0.045 ETH"}
                </Button>
            )}
        </div>
    );
}
