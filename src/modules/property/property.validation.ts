import { z } from "zod";

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().positive("Price must be greater than 0"),
    location: z.string().min(2, "Location is required"),
    amenities: z.array(z.string()).min(1, "At least 1 amenity required"),
    available: z.boolean().optional(),
    categoryId: z.string().cuid("Invalid category ID format"), 
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    location: z.string().min(2).optional(),
    amenities: z.array(z.string()).min(1).optional(),
    available: z.boolean().optional(),
    categoryId: z.string().cuid().optional(),
  }),
});

export const propertyFiltersSchema = z.object({
  query: z.object({
    location: z.string().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    category: z.string().cuid().optional(),
    
    available: z
      .string()
      .optional()
      .transform((val) => (val === "true" ? true : val === "false" ? false : undefined)),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.string().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});