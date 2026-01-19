"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type ProductInput } from "@/lib/validators/product"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function NewProductPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const form = useForm<ProductInput>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            stock: 0,
            category: "",
        },
    })

    // Manual state for logic that isn't easily controlled (file upload for now) or keep simple
    // Ideally we upload image first -> get URL -> submit form with URL.
    // Simplifying for now: Just metadata.

    async function onSubmit(data: ProductInput) {
        setIsLoading(true)
        setUploadError(null)

        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            setUploadError("You must be logged in.")
            setIsLoading(false)
            return
        }

        // Call Backend API
        const res = await fetch('http://127.0.0.1:8000/api/products/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                ...data,
                // vendor_id is handled by backend from token
                images: [] // TODO: Add Image Upload logic
            })
        })

        if (!res.ok) {
            setUploadError("Failed to create product")
            setIsLoading(false)
        } else {
            router.push('/vendor/dashboard')
            router.refresh()
        }
    }

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">List a New Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Wireless Headphones" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price ($)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" min="0" {...field} />
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
                                                <Input type="number" min="0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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
                                                <SelectItem value="books">Books</SelectItem>
                                                <SelectItem value="home-garden">Home & Garden</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your product..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Image Upload Placeholder */}
                            <div className="space-y-2">
                                <Label>Product Images</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 text-center text-gray-500 hover:bg-gray-50 cursor-pointer">
                                    <p>Click to upload images (Coming Soon)</p>
                                </div>
                            </div>

                            {uploadError && (
                                <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-md text-sm" role="alert">
                                    {uploadError}
                                </div>
                            )}

                            <div className="flex justify-end gap-4">
                                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Creating...' : 'Create Product'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
