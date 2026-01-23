"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Check for token on mount
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem("auth_token");
                localStorage.removeItem("auth_user");
            }
        }
        setIsLoading(false);
    }, []);

    // Protect routes
    useEffect(() => {
        if (isLoading) return;

        const protectedRoutes = ["/account", "/vendor", "/admin"];
        const isProtected = protectedRoutes.some(route => pathname?.startsWith(route));

        if (isProtected && !user) {
            toast.error("Please login to access this page");
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname || '/')}`);
        }
    }, [isLoading, user, pathname, router]);

    const login = (token: string, userData: User) => {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(userData));
        setUser(userData);
        toast.success("Logged in successfully");
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setUser(null);
        toast.success("Logged out");
        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}
