"use client";

import { useState } from "react";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { Button } from "@/components/ui/button";
import { Fingerprint, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function BiometricLogin() {
    const [loading, setLoading] = useState(false);
    const [method, setMethod] = useState<"authenticate" | "register" | null>(null);

    // Mock server challenge - In real app, fetch from /api/auth/webauthn/options
    const mockGetStartOptions = async (type: "login" | "register") => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return a mock Config
        // NOTE: This usually comes from the backend. 
        // Since we are mocking the backend part for this frontend-demo step, 
        // we can't fully complete the WebAuthn flow without a running FIDO2 server.
        // However, we can simulate the UI interaction.
        return {
            challenge: "random-challenge-string",
            timeout: 60000,
            rpId: window.location.hostname,
            userVerification: "preferred"
        };
    };

    const handleBiometric = async (type: "login" | "register") => {
        try {
            setLoading(true);
            setMethod(type === "login" ? "authenticate" : "register");

            const options = await mockGetStartOptions(type);

            // Real WebAuthn call will fail without valid options from a server, 
            // but let's wrap it to handle the "simulation" gracefuly.

            // For Demo purposes, if we are on localhost and don't have a backend Passkey server running:
            // We will simulate a success after a delay to show the UI state.

            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success(type === "login" ? "Biometric Verified!" : "Passkey Registered!");

            // In a real scenario:
            // const attResp = await startAuthentication(options);
            // await verifyBackend(attResp);

        } catch (error) {
            console.error(error);
            toast.error("Biometric failed. Please use password.");
        } finally {
            setLoading(false);
            setMethod(null);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-950 px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    onClick={() => handleBiometric("login")}
                    className="w-full relative overflow-hidden group border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    disabled={loading}
                >
                    {loading && method === "authenticate" ? (
                        <div className="flex items-center">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            >
                                <Fingerprint className="mr-2 h-4 w-4 text-indigo-600" />
                            </motion.div>
                            <span className="text-indigo-600">Scanning...</span>
                        </div>
                    ) : (
                        <>
                            <Fingerprint className="mr-2 h-4 w-4 text-indigo-500" />
                            Touch ID
                        </>
                    )}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => handleBiometric("register")}
                    className="w-full relative overflow-hidden group border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    disabled={loading}
                >
                    {loading && method === "register" ? (
                        <div className="flex items-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader2 className="mr-2 h-4 w-4 text-emerald-600" />
                            </motion.div>
                            <span className="text-emerald-600">Saving...</span>
                        </div>
                    ) : (
                        <>
                            <KeyRound className="mr-2 h-4 w-4 text-emerald-500" />
                            New Passkey
                        </>
                    )}
                </Button>
            </div>

            <p className="text-[10px] text-center text-muted-foreground">
                Fast & Secure login with FaceID, TouchID, or Windows Hello.
            </p>
        </div>
    );
}
