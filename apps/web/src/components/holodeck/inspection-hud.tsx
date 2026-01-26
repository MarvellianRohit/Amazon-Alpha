import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface InspectionHUDProps {
    product: any;
    onClose: () => void;
}

export function InspectionHUD({ product, onClose }: InspectionHUDProps) {
    const { addItem } = useCart();

    if (!product) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md pointer-events-none"
            >
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl pointer-events-auto mx-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                {product.name}
                            </h2>
                            <p className="text-sm text-slate-400 font-mono mt-1">
                                ID: {product.id.substring(0, 8)}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Price</span>
                            <span className="text-3xl font-bold text-white font-mono">${product.price}</span>
                        </div>

                        <Button
                            size="lg"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20"
                            onClick={() => {
                                addItem.mutate({ productId: product.id, quantity: 1 });
                                toast.success("Added to Cart!");
                            }}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
