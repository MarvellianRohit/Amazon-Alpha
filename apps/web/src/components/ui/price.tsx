"use client"

import { useCurrency } from "@/components/providers/currency-provider";
import { cn } from "@/lib/utils";

interface PriceProps {
    amount: number;
    className?: string;
    showOriginal?: boolean; // For strikethru price
}

export function Price({ amount, className, showOriginal = false }: PriceProps) {
    const { format } = useCurrency();

    // Prevent negative checks or other potential issues if necessary
    // Assuming amount is in USD

    return (
        <span className={cn(showOriginal && "line-through text-muted-foreground", className)}>
            {format(amount)}
        </span>
    );
}
