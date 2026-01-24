"use client";

import { useEffect } from "react";

export function usePredictivePrefetch(userId: string, currentCategory: string) {
    useEffect(() => {
        if (!currentCategory) return;

        const runPrefetch = async () => {
            try {
                // Call Backend to predict next moves
                const res = await fetch(`http://127.0.0.1:8000/api/v1/cdn/prefetch?user_id=${userId}&category=${currentCategory}`);
                const data = await res.json();

                if (data.action === "CDN_PREWARM_TRIGGERED") {
                    console.log(`[Prefetch] Warming Assets for: ${data.predicted_next}`);

                    // Inject Preload Links
                    data.assets.forEach((assetUrl: string) => {
                        const link = document.createElement("link");
                        link.rel = "preload";
                        link.as = assetUrl.endsWith(".mp4") ? "video" : "image";
                        link.href = assetUrl;
                        document.head.appendChild(link);
                    });
                }
            } catch (e) {
                console.error("Prefetch Error", e);
            }
        };

        // Delay slightly to not block interaction
        const timer = setTimeout(runPrefetch, 1000);
        return () => clearTimeout(timer);
    }, [userId, currentCategory]);
}
