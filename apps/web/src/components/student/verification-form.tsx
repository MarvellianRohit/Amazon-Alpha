"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud, Camera, Loader2, FileCheck } from "lucide-react";
import { toast } from "sonner";

export function VerificationForm() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);

        try {
            // Mock Upload for Frontend Demo (Backend integration would go here)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Set verified status
            localStorage.setItem("is_verified_student", "true");
            toast.success("ID Verification Successful! Welcome to the Club.");
            window.location.reload();

        } catch (error) {
            toast.error("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto border-2 border-dashed border-indigo-200 bg-indigo-50/50">
            <CardHeader className="text-center">
                <CardTitle className="text-indigo-900">Verify Student ID</CardTitle>
                <CardDescription>Upload a clear photo of your college ID card to unlock.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

                {/* Adaptive Dropzone */}
                <div
                    className={`relative h-64 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden
                        ${isDragging ? 'border-indigo-500 bg-indigo-100' : 'border-gray-300 bg-white hover:bg-gray-50'}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    {file ? (
                        <div className="flex flex-col items-center text-green-600 animate-in fade-in zoom-in">
                            <FileCheck className="w-12 h-12 mb-2" />
                            <span className="font-medium text-sm truncate max-w-[200px]">{file.name}</span>
                            <span className="text-xs text-gray-400 mt-1">Tap to change</span>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View Hint */}
                            <div className="hidden md:flex flex-col items-center text-gray-500">
                                <UploadCloud className="w-12 h-12 mb-2 text-indigo-400" />
                                <p className="font-medium">Drag & Drop ID Here</p>
                                <p className="text-xs mt-1">or click to browse</p>
                            </div>

                            {/* Mobile View Hint */}
                            <div className="md:hidden flex flex-col items-center text-gray-500">
                                <Camera className="w-12 h-12 mb-2 text-indigo-400" />
                                <p className="font-medium">Tap to Take Photo</p>
                            </div>
                        </>
                    )}
                </div>

                <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12"
                    disabled={!file || isUploading}
                    onClick={handleUpload}
                >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Verify Identity"}
                </Button>
            </CardContent>
        </Card>
    );
}
