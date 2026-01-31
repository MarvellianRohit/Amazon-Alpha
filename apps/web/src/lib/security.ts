import arcjet, { detectBot, shield, fixedWindow } from "@arcjet/next";

// Re-export the Security Rules for use in Middleware
export const securityRules = arcjet({
    // Get your site key from https://app.arcjet.com
    // For Alpha/Demo, we can leave this generic or use a placeholder env var.
    // Ideally: process.env.ARCJET_KEY
    key: process.env.ARCJET_KEY!,
    rules: [
        // 1. Shield: Protects against common attacks (SQLi, XSS, etc.)
        shield({ mode: "LIVE" }), // LIVE blocks attacks. DRY_RUN only logs.

        // 2. Bot Detection: Blocks automated bots
        detectBot({
            mode: "LIVE",
            // Allow useful bots (search engines, preview bots), block everything else
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:PREVIEW",
                "CATEGORY:MONITOR" // Uptime monitors
            ],
        }),

        // 3. Rate Limiting: 100 requests per minute per IP
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 100,
        }),
    ],
});
