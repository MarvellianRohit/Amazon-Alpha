"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Upload, CheckCircle2, AlertCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function StudentVerificationPage() {
    const [email, setEmail] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [verificationStatus, setVerificationStatus] = useState<"idle" | "verified" | "pending" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !email) {
            toast.error("Please provide both email and student ID")
            return
        }

        setIsSubmitting(true)
        setVerificationStatus("idle")

        try {
            const formData = new FormData()
            formData.append("email", email)
            formData.append("file", file)

            // Direct fetch to handle FormData properly (apiClient forces json)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/students/verify`, {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Verification request failed")
            }

            const data = await response.json()

            if (data.status === "success") {
                setVerificationStatus(data.verification_status)
                setMessage(data.message)
                if (data.verification_status === "verified") {
                    toast.success("Student Verified Successfully!")
                } else {
                    toast.info("Verification Pending")
                }
            } else {
                setVerificationStatus("error")
                setMessage("Unexpected response from server")
            }

        } catch (error) {
            console.error(error)
            setVerificationStatus("error")
            setMessage("Failed to connect to verification server")
            toast.error("Verification failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border-2 border-indigo-100 dark:border-indigo-900/50 shadow-2xl overflow-hidden relative">
                        {/* Decorative background blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
                                <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Student Verification</CardTitle>
                            <CardDescription>
                                Unlock exclusive discounts and access the Holodeck learning features.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {verificationStatus === "verified" ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-8 space-y-4"
                                >
                                    <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Verification Complete!</h3>
                                    <p className="text-muted-foreground">
                                        Welcome to Amazon Alpha Student. Your exclusive pricing is now active.
                                    </p>
                                    <Button className="w-full mt-4" onClick={() => window.location.href = '/'}>
                                        Start Shopping
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Student Email (.edu)</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@university.edu"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="file">Student ID Card</Label>
                                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                id="file"
                                                accept="image/*,.pdf"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleFileChange}
                                                required
                                            />
                                            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                            <p className="text-sm font-medium">
                                                {file ? file.name : "Upload Student ID"}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {file ? "Click to change" : "Image or PDF (max 5MB)"}
                                            </p>
                                        </div>
                                    </div>

                                    {verificationStatus === "error" && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 p-3 rounded-lg">
                                            <AlertCircle className="h-4 w-4" />
                                            {message}
                                        </div>
                                    )}

                                    {verificationStatus === "pending" && (
                                        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-lg">
                                            <AlertCircle className="h-4 w-4" />
                                            {message}
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
                                        {isSubmitting ? "Verifying..." : "Verify Status"}
                                    </Button>
                                </form>
                            )}
                        </CardContent>

                        {verificationStatus !== "verified" && (
                            <CardFooter className="justify-center text-xs text-muted-foreground">
                                Mock verification: Use any .edu email to pass.
                            </CardFooter>
                        )}
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
