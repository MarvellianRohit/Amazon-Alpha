import { useState, useRef } from "react";
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
    onImageSelected: (file: File) => void;
    disabled?: boolean;
}

export function ImageUploader({ onImageSelected, disabled }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }
        // Limit to 5MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
            onImageSelected(file);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="relative">
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                disabled={disabled}
            />

            <AnimatePresence>
                {preview ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="mb-2 relative w-24 h-24 rounded-lg overflow-hidden border border-white/10 group"
                    >
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            onClick={clearImage}
                            className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={12} />
                        </button>
                    </motion.div>
                ) : (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={disabled}
                        className={cn(
                            "p-2 text-white/50 hover:text-white transition-colors hover:bg-white/10 rounded-full",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                        title="Upload Image for Visual Search"
                    >
                        <ImageIcon size={20} />
                    </button>
                )}
            </AnimatePresence>
        </div>
    );
}
