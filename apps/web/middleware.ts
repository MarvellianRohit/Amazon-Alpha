import { createMiddleware } from "@arcjet/next";
import { securityRules } from "./src/lib/security";
import { NextResponse } from "next/server";

// Create Arcjet Middleware
export default createMiddleware(securityRules);

export const config = {
    // Matcher ignoring static files
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
