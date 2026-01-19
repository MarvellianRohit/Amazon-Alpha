"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/search/product-card";
import { useViewHistory } from "@/hooks/use-view-history";
import { Sparkles, Loader2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function RecommendedSection() {
    const { history } = useViewHistory();
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (history.length === 0) return;

            setIsLoading(true);
            try {
                const res = await fetch("http://127.0.0.1:8000/api/v1/recommendations/recommend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ product_ids: history })
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setRecommendations(data);
                }
            } catch (error) {
                console.error("Failed to load recommendations", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [history]);

    if (!history.length && !isLoading) return null; // Don't show if cold start user

    return (
        <section className="py-8 space-y-4">
            <div className="flex items-center gap-2 px-4">
                <Sparkles className="w-5 h-5 text-purple-600 fill-current" />
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                    Recommended for You
                </h2>
            </div>

            <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex w-max space-x-4 p-4">
                    {isLoading ? (
                        // Loader Skeletons
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="w-[200px] h-[300px] bg-gray-100 rounded-lg animate-pulse" />
                        ))
                    ) : (
                        recommendations.map((product) => (
                            <div key={product.id} className="w-[250px] whitespace-normal">
                                <ProductCard product={product} />
                            </div>
                        ))
                    )}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </section>
    );
}
