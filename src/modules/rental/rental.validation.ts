import { z } from "zod";

// Create Rental Schema (Tenant)
export const createRentalSchema = z.object({
  body: z.object({
    propertyId: z.string().min(1, "Property ID is required"),
    moveInDate: z.string().datetime({ message: "Invalid date format" }).optional(),
    message: z.string().optional(),
  }),
});

// Update Rental Status Schema (Landlord)
export const updateRentalStatusSchema = z.object({
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED"], {
      message: "Status must be either APPROVED or REJECTED",
    }),
  }),
});

// Get Rentals with Filters
export const rentalFiltersSchema = z.object({
  query: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10).optional(),
    sortBy: z.string().default('createdAt').optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
  }).default({}),
});