import { z } from "zod"

export const productSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }),
    price: z.coerce.number().min(0.01, { message: "Price must be greater than 0" }),
    stock: z.coerce.number().int().min(0, { message: "Stock cannot be negative" }),
    // In V2, we might want category_id, but for now assuming string category or select from ID.
    // Let's use string for generic category until we fetch dynamic categories in UI.
    category: z.string().min(1, { message: "Please select a category" }),
})

export type ProductInput = z.infer<typeof productSchema>
