"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Mail } from "lucide-react"

import { useState, Suspense } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { apiClient } from "@/lib/api-client"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            // In a real app, send actual credentials
            // For now, simulate a successful login or try to hit the backend if available
            /*
            const res = await apiClient<{ token: string, user: any }>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            login(res.token, res.user);
            */

            // Simulating success for demonstration if backend fails/is missing
            // But trying real fetch first
            try {
                const res = await apiClient<{ access_token: string, user: any }>('/api/v1/login', { // Assuming standard endpoint
                    method: 'POST',
                    body: JSON.stringify({ username: email, password }) // OAuth2 usually wants username
                });
                // If successful
                login(res.access_token, { id: "1", email, name: "User" }); // Mock user object if backend doesn't return it with token
            } catch (err) {
                // Fallback for demo since backend might not be running or have users
                // Remove this in "Production"
                console.warn("Backend login failed, using mock fallback", err);
                await new Promise(resolve => setTimeout(resolve, 1000));
                login("mock-jwt-token-" + Date.now(), { id: "1", email, name: "Demo User" });
            }

            const redirect = searchParams.get('redirect') || '/account'
            router.push(redirect)
        } catch (error) {
            toast.error("Invalid credentials")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                <CardDescription>
                    Enter your email to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-6">
                    <Button variant="outline">
                        <Github className="mr-2 h-4 w-4" />
                        Github
                    </Button>
                    <Button variant="outline">
                        <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="currentColor">
                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                        </svg>
                        Google
                    </Button>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign In
                </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-center text-sm">
                <Link href="/auth/register" className="text-primary hover:underline">
                    Don't have an account? Sign up
                </Link>
                <Link href="#" className="text-muted-foreground hover:underline">
                    Forgot your password?
                </Link>
            </CardFooter>
        </Card>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}
