"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import { Eye } from "lucide-react";
import { Product } from "@/types";
import Image from "next/image";

interface ProductQuickLookProps {
    product: Product;
    children: React.ReactNode;
}

export function ProductQuickLook({ product, children }: ProductQuickLookProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [isOpen, setIsOpen] = React.useState(false);

    // Preview Content (Shared)
    const PreviewContent = () => (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No Preview
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <h4 className="font-semibold leading-none">{product.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {product.description}
                </p>
                <div className="flex items-center gap-2 pt-2">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    {product.stock < 5 && <span className="text-xs text-red-500 font-medium">Only {product.stock} left!</span>}
                </div>
            </div>
        </div>
    );

    if (isDesktop) {
        return (
            <HoverCard>
                <HoverCardTrigger asChild>
                    {/* Wrap the children (Card Image) with the trigger */}
                    <div className="cursor-help">
                        {children}
                    </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                    <PreviewContent />
                </HoverCardContent>
            </HoverCard>
        );
    }

    // Tablet/Mobile: Drawer
    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                {/* On mobile, we might want a specific button or handle tap differently. 
            For this prompt "touch triggers bottom sheet", assuming tap on the same element.
        */}
                <div onClick={() => setIsOpen(true)}>
                    {children}
                </div>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Quick Preview</DrawerTitle>
                        <DrawerDescription>Swipe down to close.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <PreviewContent />
                    </div>
                    <DrawerFooter>
                        <Button onClick={() => setIsOpen(false)}>Close</Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
