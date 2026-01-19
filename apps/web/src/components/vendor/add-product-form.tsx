'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, UploadCloud, X, Sparkles } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { createClient } from "@/lib/supabase/client";

const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    price: z.coerce.number().min(0.01, "Price must be greater than 0."),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
    category: z.string().min(1, "Please select a category."),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any, // Using strict resolver now
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock: 0,
        },
    });

    const onDrop = (acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    const generateDescription = async () => {
        const name = form.getValues("name");
        if (!name || name.length < 3) {
            toast.error("Please enter a product name first.");
            return;
        }

        const toastId = toast.loading("Generating description...");

        try {
            // Call FastAPI AI Endpoint
            // Note: In a real app, use the secure backend URL or proxy
            const response = await fetch("http://127.0.0.1:8000/api/ai/generate_desc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: name })
            });

            if (!response.ok) throw new Error("AI generation failed");

            const data = await response.json();
            form.setValue("description", data.description);
            toast.success("Description generated!", { id: toastId });
        } catch (error) {
            toast.error("Failed to generate description", { id: toastId });
        }
    };

    async function onSubmit(data: ProductFormValues) {
        setIsLoading(true);

        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error("You must be logged in to add a product.");
            }

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price.toString());
            formData.append("stock", data.stock.toString());
            formData.append("category", data.category);

            files.forEach(file => {
                formData.append("files", file);
            });

            // Call FastAPI Endpoint
            const response = await fetch("http://localhost:8080/api/products/create", {
                method: "POST",
                headers: {
                    // 'Content-Type': 'multipart/form-data', // Do NOT set this manually with fetch + FormData
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to create product");
            }

            toast.success("Product created successfully!");

            form.reset();
            setFiles([]);

        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Wireless Headphones" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="electronics">Electronics</SelectItem>
                                        <SelectItem value="clothing">Clothing</SelectItem>
                                        <SelectItem value="home">Home & Garden</SelectItem>
                                        <SelectItem value="books">Books</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel>Description</FormLabel>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                    onClick={generateDescription}
                                >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Generate with AI
                                </Button>
                            </div>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe your product..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock Quantity</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* File Upload Zone */}
                <div className="space-y-4">
                    <FormLabel>Product Images</FormLabel>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary'}`}
                    >
                        <input {...getInputProps()} />
                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground text-center">
                            {isDragActive ? "Drop images here" : "Drag & drop images here, or click to select"}
                        </p>
                    </div>

                    {files.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {files.map((file, index) => (
                                <div key={index} className="relative group border rounded-md p-2">
                                    <div className="text-xs truncate mb-1">{file.name}</div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="h-6 w-6 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Product
                </Button>
            </form>
        </Form>
    );
}
