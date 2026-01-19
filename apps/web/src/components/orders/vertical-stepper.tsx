"use client";

import { Check, Truck, Package, MapPin, Box } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderStatus = 'Pending' | 'Shipped' | 'In-Transit' | 'Out-for-Delivery' | 'Delivered';

const STEPS = [
    { status: 'Pending', label: 'Order Placed', icon: Box, description: 'We have received your order.' },
    { status: 'Shipped', label: 'Shipped', icon: Package, description: 'Your package has left our warehouse.' },
    { status: 'In-Transit', label: 'In Transit', icon: Truck, description: 'Your package is on the way.' },
    { status: 'Out-for-Delivery', label: 'Out for Delivery', icon: Truck, description: 'The courier is in your area.' },
    { status: 'Delivered', label: 'Delivered', icon: MapPin, description: 'Package delivered.' },
];

export function VerticalStepper({ currentStatus }: { currentStatus: OrderStatus }) {
    const currentIndex = STEPS.findIndex(s => s.status === currentStatus);
    // Fallback if status not found (e.g. unknown status), default to 0
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;

    return (
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 my-4">
            {STEPS.map((step, index) => {
                const isActive = index === activeIndex;
                const isCompleted = index < activeIndex;
                const Icon = step.icon;

                return (
                    <div key={step.status} className="relative pl-8">
                        {/* Dot Indicator */}
                        <div className={cn(
                            "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-colors duration-300 bg-white",
                            isCompleted ? "border-green-500 bg-green-500" :
                                isActive ? "border-blue-600 bg-blue-600" : "border-slate-300"
                        )}>
                            {isCompleted && <Check className="w-2.5 h-2.5 text-white absolute top-0.5 left-0.5" />}
                        </div>

                        {/* Content */}
                        <div className={cn(
                            "transition-opacity duration-300",
                            isActive ? "opacity-100" : isCompleted ? "opacity-70" : "opacity-40"
                        )}>
                            <h4 className={cn(
                                "text-sm font-semibold flex items-center gap-2",
                                isActive ? "text-blue-700" : isCompleted ? "text-green-700" : "text-slate-600"
                            )}>
                                <Icon className="w-4 h-4" />
                                {step.label}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                            {isActive && (
                                <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full animate-pulse">
                                    Current Status
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
