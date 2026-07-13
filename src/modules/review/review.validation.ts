import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    comment: z.string().min(3, "Comment must be at least 3 characters").max(500, "Comment must be at most 500 characters"),
    propertyId: z.string().min(1, "Property ID is required"),
  }),
});

export const reviewFiltersSchema = z.object({
  query: z.object({
    rating: z.coerce.number().int().min(1).max(5).optional(),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10).optional(),
    sortBy: z.string().default('createdAt').optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
  }).default({}),
});