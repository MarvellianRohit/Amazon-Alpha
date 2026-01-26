"use client";

import { useSupernovaStore } from "@/store/supernova-store";
import { motion } from "framer-motion";
import { Maximize2, Box } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SupernovaPortalProps {
    productId?: string;
    productName?: string;
    className?: string;
}

export const SupernovaPortal = ({
    productId,
    productName = "Product",
    className,
}: SupernovaPortalProps) => {
    const router = useRouter();
    const { setActiveProduct, setImmersiveMode } = useSupernovaStore();

    const handleEnterSupernova = () => {
        if (productId) {
            setActiveProduct(productId);
        }
        setImmersiveMode(true);
        router.push("/holodeck");
    };

    return (
        <div className={`relative group ${className}`}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900/90 to-purple-900/90 p-[1px]"
            >
                <div className="relative flex items-center justify-between gap-4 rounded-xl bg-black/40 px-6 py-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/50">
                            <Box className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">View in Supernova</h3>
                            <p className="text-sm text-indigo-200/80">
                                Inspect {productName} in 3D
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handleEnterSupernova}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 hover:text-indigo-300"
                    >
                        <Maximize2 className="h-5 w-5" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
